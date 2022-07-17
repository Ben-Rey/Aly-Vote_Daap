/* eslint-disable tailwindcss/no-custom-classname */
import { IButtonProps } from './IButtonProps'

const Button = ({
  onClick,
  className,
  variant = 'filled',
  disabled = false,
  children,
  loading = false,
  ...props
}: IButtonProps) => {
  const variants = {
    outlined: `btn-outline`,
    filled: ``
  }

  const btnDisabled = disabled ? 'btn-disabled' : ''

  return (
    <button
      className={`${className || ''} btn ${btnDisabled} ${variants[variant]} ${
        loading && 'btn-loading'
      }`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
