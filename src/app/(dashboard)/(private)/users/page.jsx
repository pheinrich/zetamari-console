import Grid from '@mui/material/Grid2'
import { ToastContainer } from 'react-toastify'
import { readUsers } from '@/db/actions/user'
import UsersListTable from './UsersListTable'

export default async function UsersPage()
{
  const users = await readUsers()

  return (
    <>
      <ToastContainer />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <UsersListTable userData={users} />
        </Grid>
      </Grid>
    </>
  )
}
