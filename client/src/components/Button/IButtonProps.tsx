export interface IButtonProps {
  onClick?: () => void
  className?: string
  label?: string
  disabled?: boolean
  variant?: 'outlined' | 'filled'
  children?: React.ReactNode
  loading?: boolean
}
