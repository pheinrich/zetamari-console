import classnames from 'classnames'

import Calculator from '@views/apps/calculator/Calculator'

import { commonLayoutClasses } from '@layouts/utils/layoutClasses'

import styles from '@views/apps/calculator/styles.module.css'

const CalculatorPage = () => {
  return (
    <div
      className={classnames(
        commonLayoutClasses.contentHeightFixed,
        styles.scroll,
        'is-full overflow-auto pis-2 -mis-2'
      )}
    >
      <Calculator />
    </div>
  )
}

export default CalculatorPage
