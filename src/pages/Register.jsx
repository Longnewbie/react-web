import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import Typography from '@mui/material/Typography'
import HutechIcon from '../assets/hutechLogo.png'
import bg from '../assets/bg.jpg'
import { useNavigate } from 'react-router-dom'
import { registerAPI } from '~/apis'
import { toast } from 'react-toastify'

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const BackLogIn = async (data) => {
    // lấy dữ liệu từ form
    const { username, email, password } = data
    // gọi api
    await registerAPI({ email, password, username })
    // lưu thông tin của User vào Localstorage phía fe
    // localStorage.setItem('userInfo', JSON.stringify(user))
    // điều hướng tới trang Dashboard
    toast.success('Register successfully!')
    navigate('/login')
}

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: `url(${bg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)'
    }}>
      <form onSubmit={handleSubmit(BackLogIn)}>
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <MuiCard sx={{ minWidth: 480, maxWidth: 480, marginTop: '6em', p: '2em 1em', borderRadius: 2 }}>
            <Box sx={{ width: '70px', bgcolor: 'white', margin: '0 auto' }}>
              <a style={{ color: 'inherit', textDecoration: 'none' }} href='' target='_blank' rel='noreferrer'>
                <img src={HutechIcon} alt='Team-7FU' width='100%' />
              </a>
            </Box>
            <Box sx={{ padding: '0 1em 1em 1em' }}>
              <Box sx={{ marginTop: '1.2em' }}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Enter username..."
                  type="text"
                  variant="outlined"
                  error={!!errors.username}
                  {...register('username', {
                    required: 'This field is required.'
                  })}
                />
                {errors.username &&
                  <Alert severity="error" sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                    {errors.username.message}
                  </Alert>
                }
              </Box>
              <Box sx={{ marginTop: '1.2em' }}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Enter Email..."
                  type="text"
                  variant="outlined"
                  error={!!errors.email}
                  {...register('email', {
                    required: 'This field is required.'
                  })}
                />
                {errors.email &&
                  <Alert severity="error" sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                    {errors.email.message}
                  </Alert>
                }
              </Box>

              <Box sx={{ marginTop: '1em' }}>
                <TextField
                  fullWidth
                  label="Enter Password..."
                  type="password"
                  variant="outlined"
                  error={!!errors.password}
                  {...register('password', {
                    required: 'This field is required.'
                  })}
                />
                {errors.password &&
                  <Alert severity="error" sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                    {errors.password.message}
                  </Alert>
                }
              </Box>
            </Box>
            <CardActions>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                 Register
              </Button>
            </CardActions>
          </MuiCard>
        </Zoom>
      </form>
    </Box>
  )
}

export default Register
