import { IButtonProps } from './IButtonProps'

const Button = ({
  onClick,
  className,
  variant = 'filled',
  disabled = false,
  children,
  ...props
}: IButtonProps) => {
  const variants = {
    outlined: `btn-outline`,
    filled: ``
  }

  const btnDisabled = disabled ? 'btn-disabled' : ''

  return (
    <button
      className={`${className || ''} btn ${btnDisabled} ${variants[variant]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
