'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { readUsedInChoices, updateProductUsedIn } from '@/db/actions/product'

// Number-aware, so 7" sorts before 10".
const compare = (field) => (a, b) => (a[field] ?? '').localeCompare( b[field] ?? '', undefined, {numeric: true} )
const byName = compare( 'name' )
const bySku = compare( 'sku' )

// Popup listing every other product, checked where its bill of materials
// includes this one. Checking/unchecking adds/removes this product from
// that BOM on Save.
export default function UsedInReviewDialog( {open, setOpen, product} )
{
  const router = useRouter()
  const [choices, setChoices] = useState( null )
  const [checked, setChecked] = useState( new Set() )
  const [search, setSearch] = useState( '' )
  // `sortChecked` is the checked set as of the last sort, so ticking a box
  // while sorted by checkbox doesn't make rows jump out from under you.
  const [sort, setSort] = useState( {by: 'checked', dir: 'desc', sortChecked: new Set()} )
  const [error, setError] = useState( null )
  const [isSaving, startSave] = useTransition()

  // (Re)load on each open, so the list reflects any BOM edits made since.
  useEffect( () => {
    if( !open )
      return

    let cancelled = false

    setChoices( null )
    setSearch( '' )
    setError( null )

    readUsedInChoices( product.id )
      .then( (rows) => {
        if( cancelled )
          return

        const initial = new Set( rows.filter( (r) => r.usesThis ).map( (r) => r.id ) )

        setChoices( rows )
        setChecked( initial )
        setSort( {by: 'checked', dir: 'desc', sortChecked: initial} )
      })
      .catch( () => !cancelled && setError( 'Failed to load the product list.' ) )

    return () => { cancelled = true }
  }, [open, product.id] )

  const added = useMemo( () => (choices ?? []).filter( (c) => !c.usesThis && checked.has( c.id ) ).map( (c) => c.id ), [choices, checked] )
  const removed = useMemo( () => (choices ?? []).filter( (c) => c.usesThis && !checked.has( c.id ) ).map( (c) => c.id ), [choices, checked] )
  const dirty = added.length > 0 || removed.length > 0

  const rows = useMemo( () => {
    const term = search.trim().toLowerCase()
    const filtered = (choices ?? []).filter( (c) => !term || c.name.toLowerCase().includes( term ) || c.sku?.toLowerCase().includes( term ) )
    const sign = sort.dir === 'asc' ? 1 : -1

    return filtered.sort( (a, b) => {
      if( sort.by === 'checked' )
      {
        const diff = Number( sort.sortChecked.has( a.id ) ) - Number( sort.sortChecked.has( b.id ) )
        if( diff )
          return sign * diff

        return byName( a, b )
      }

      return sign * (sort.by === 'sku' ? bySku( a, b ) : byName( a, b ))
    })
  }, [choices, search, sort] )

  function handleSort( by )
  {
    setSort( (s) => ({
      by,
      dir: s.by === by ? (s.dir === 'asc' ? 'desc' : 'asc') : (by === 'checked' ? 'desc' : 'asc'),
      sortChecked: new Set( checked ),
    }) )
  }

  function toggle( id )
  {
    setChecked( (prev) => {
      const next = new Set( prev )
      next.has( id ) ? next.delete( id ) : next.add( id )

      return next
    })
  }

  function handleClose()
  {
    if( !isSaving )
      setOpen( false )
  }

  function handleSave()
  {
    setError( null )

    startSave( async () => {
      const result = await updateProductUsedIn( product.id, added, removed )

      if( result?.error )
      {
        setError( result.error )

        return
      }

      toast.success( 'Bills of materials updated' )
      setOpen( false )
      router.refresh()
    })
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' closeAfterTransition={false}>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Used as a Material</div>
        <Typography component='span' className='flex flex-col text-center'>
          Check each product whose bill of materials should include {product.name}.
        </Typography>
      </DialogTitle>
      <DialogContent className='flex flex-col gap-4 pbs-0 sm:pli-16'>
        <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>

        {error && <Alert severity='error'>{error}</Alert>}

        <TextField
          fullWidth
          size='small'
          placeholder='Search by name or SKU'
          value={search}
          onChange={(e) => setSearch( e.target.value )}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='ri-search-line' />
                </InputAdornment>
              ),
            },
          }}
        />

        {!choices ? (
          !error && (
            <div className='flex justify-center plb-12'>
              <CircularProgress />
            </div>
          )
        ) : (
          <TableContainer className='border rounded' sx={{ maxHeight: '50vh' }}>
            <Table stickyHeader size='small'>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <TableSortLabel
                      active={sort.by === 'checked'}
                      direction={sort.by === 'checked' ? sort.dir : 'desc'}
                      onClick={() => handleSort( 'checked' )}
                    >
                      <i className='ri-checkbox-line text-lg' />
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.by === 'name'}
                      direction={sort.by === 'name' ? sort.dir : 'asc'}
                      onClick={() => handleSort( 'name' )}
                    >
                      Product
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.by === 'sku'}
                      direction={sort.by === 'sku' ? sort.dir : 'asc'}
                      onClick={() => handleSort( 'sku' )}
                    >
                      SKU
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map( (row) => {
                  const isChecked = checked.has( row.id )
                  // Already-listed rows stay uncheckable even if they'd now
                  // form a cycle, so a bad existing link can be removed.
                  const disabled = row.wouldCycle && !isChecked

                  return (
                    <TableRow
                      key={row.id}
                      hover={!disabled}
                      onClick={disabled ? undefined : () => toggle( row.id )}
                      className={disabled ? undefined : 'cursor-pointer'}
                    >
                      <TableCell padding='checkbox'>
                        {disabled ? (
                          <Tooltip title={`Already a material of ${product.name} - listing it here would form a cycle`}>
                            <span>
                              <Checkbox disabled />
                            </span>
                          </Tooltip>
                        ) : (
                          <Checkbox checked={isChecked} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography color={disabled ? 'text.disabled' : 'text.primary'}>{row.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color={disabled ? 'text.disabled' : 'text.secondary'} className='whitespace-nowrap'>{row.sku}</Typography>
                      </TableCell>
                    </TableRow>
                  )
                } )}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align='center'>
                      <Typography color='text.secondary' className='plb-4'>No matching products.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {dirty && (
          <Typography variant='body2' color='text.secondary'>
            {[
              added.length && `adding to ${added.length} product${added.length === 1 ? '' : 's'} (quantity 1)`,
              removed.length && `removing from ${removed.length} product${removed.length === 1 ? '' : 's'}`,
            ].filter( Boolean ).join( ', ' ).replace( /^./, (c) => c.toUpperCase() )}.
          </Typography>
        )}
      </DialogContent>
      <DialogActions className='justify-center sm:pbe-16 sm:pli-16'>
        <Button variant='contained' onClick={handleSave} disabled={!dirty || isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
