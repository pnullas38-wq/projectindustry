export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  fullName: string
}

export function validateRegisterForm(form: RegisterForm): string | null {
  if (!form.fullName.trim()) return 'Full name is required'
  if (form.username.length < 3) return 'Username must be at least 3 characters'
  if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    return 'Username can only contain letters, numbers, and underscores'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address'
  if (form.password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(form.password)) return 'Password needs at least one uppercase letter'
  if (!/[a-z]/.test(form.password)) return 'Password needs at least one lowercase letter'
  if (!/[0-9]/.test(form.password)) return 'Password needs at least one number'
  if (form.password !== form.confirmPassword) return 'Passwords do not match'
  return null
}
