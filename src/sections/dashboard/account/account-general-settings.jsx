import PropTypes from 'prop-types';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import { alpha } from '@mui/system/colorManipulator';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import { useAuth } from 'src/hooks/use-auth';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
import { Issuer } from 'src/utils/auth';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { usersApi } from 'src/api/users/userService';
import 'src/toast.css';
import { getInitials } from 'src/utils/get-initials';
import axios from 'axios';

export const AccountGeneralSettings = (props) => {
  const { avatar, email, name, lastname } = props;
  const [newData, setNewData] = useState({
    avatar: avatar,
    email: email,
    name: name,
    lastname: lastname,
    password: '',
  });

  const [selectedImage, setSelectedImage] = useState({ name: '', dataURL: '' });
  const [photo, setPhoto] = useState('');
  const [uploading, setUploading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [changeColorBorder, setChangeColorBorder] = useState('neutral.500');
  const router = useRouter();
  const auth = useAuth();

  const handleConfirm = () => {
    toast(
      (t) => (
        <span>
          ¿Estás seguro?
          <Button onClick={() => toast.dismiss(t.id)}>Cancelar</Button>
          <Button
            onClick={() => handleLogout(t.id)}
            variant="contained"
          >
            Sí
          </Button>
        </span>
      ),
      {
        duration: 5000,
      }
    );
  };

  const handleLogout = useCallback(
    async (toastId) => {
      try {
        switch (auth.issuer) {
          case Issuer.JWT: {
            const response = await usersApi.deleteUser({ email: newData.email });
            if (response.status == 'SUCCESS') {
              await auth.signOut();
              toast.success(response.message, { duration: 5000, position: 'top-center' });
              toast.dismiss(toastId);
            }
            break;
          }
        }
        router.push(paths.index);
      } catch (err) {
        console.error(err, { duration: 5000, position: 'top-center' });
        toast.error('Algo salió mal!');
      }
    },
    [auth, router]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setDisabled(true);
    try {
      switch (auth.issuer) {
        case Issuer.JWT: {
          const { status, message } = await usersApi.updateUser(newData);
          if (status === 'success') {
            await auth.initialize();
            setDisabled(false);
            toast.success(message, { duration: 3000, position: 'top-center' });
          }
          break;
        }
      }
    } catch (err) {
      console.error(err);
      setDisabled(false);
      toast.error(err.message, { duration: 3000, position: 'top-center' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage({
          name: `${Date.now()}.${file.type.split('/')[1]}`,
          dataURL: reader.result,
        });
        setChangeColorBorder('neutral.300');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage.dataURL) {
      setChangeColorBorder('red');
      return;
    }

    setUploading(true);

    const binaryData = atob(selectedImage.dataURL.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const byteArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    const params = {
      Bucket: 'user-photo-taxes',
      Key: selectedImage.name,
      Body: byteArray,
      ContentType: `image/${selectedImage.name.split('.').pop()}`,
    };

    try {
      const response = await axios.post('/api/upload', params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);

      const { status, data } = response;

      if (status === 'success') {
        const { status, message } = await usersApi.updateUser({
          ...newData,
          ['avatar']: selectedImage.name,
        });
        if (status == 'success') {
          setNewData({ ...newData, ['avatar']: selectedImage.name });
          await auth.initialize();
          toast.success(message, { duration: 3000, position: 'top-center' });
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      toast.error('Error al cargar imagen');
    }

    setUploading(false);
  };

  useEffect(() => {
    if (newData?.avatar) {
      const url = `/path/to/user/photos/${newData.avatar}`;
      setPhoto(url);
      setSelectedImage({ name: '', dataURL: '' });
    }
  }, [newData]);

  return (
    <Stack
      spacing={4}
      {...props}
    >
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">Detalles básicos</Typography>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack spacing={3}>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <Box
                    sx={{
                      borderColor: changeColorBorder,
                      borderRadius: '50%',
                      borderStyle: 'dashed',
                      borderWidth: 1,
                      p: '4px',
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: '50%',
                        height: '100%',
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                          borderRadius: '50%',
                          color: 'common.white',
                          cursor: 'pointer',
                          display: 'flex',
                          height: '100%',
                          justifyContent: 'center',
                          left: 0,
                          opacity: 0,
                          position: 'absolute',
                          top: 0,
                          width: '100%',
                          zIndex: 1,
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        <input
                          accept="image/*"
                          type="file"
                          onChange={handleImageChange}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            zIndex: 1,
                            cursor: 'pointer',
                          }}
                        />
                        <Stack
                          alignItems="center"
                          direction="column"
                          spacing={1}
                        >
                          <SvgIcon
                            color="inherit"
                            sx={{ fontSize: 48 }}
                          >
                            <Camera01Icon />
                          </SvgIcon>
                          <Typography
                            color="inherit"
                            variant="subtitle2"
                            sx={{ fontWeight: 700, fontSize: 12 }}
                          >
                            Seleccionar
                          </Typography>
                        </Stack>
                      </Box>
                      <Avatar
                        src={selectedImage.dataURL || photo}
                        sx={{
                          height: 100,
                          width: 100,
                          fontSize: 24,
                        }}
                        name="avatar"
                      >
                        {getInitials(name + ' ' + lastname)}
                      </Avatar>
                    </Box>
                  </Box>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Subiendo...' : 'Subir'}
                  </Button>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    fullWidth
                    value={newData?.name}
                    name="name"
                    onChange={handleChange}
                    label="Nombre"
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    fullWidth
                    value={newData?.lastname}
                    name="lastname"
                    onChange={handleChange}
                    label="Apellidos"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    disabled={disabled}
                    color="inherit"
                    size="small"
                    onClick={handleUpdate}
                  >
                    Guardar
                  </Button>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    fullWidth
                    value={newData?.email}
                    name="email"
                    onChange={handleChange}
                    disabled
                    label="Correo Electrónico"
                    required
                    sx={{
                      flexGrow: 1,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed',
                      },
                    }}
                  />
                  <Button
                    color="inherit"
                    size="small"
                  >
                    Editar
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">Eliminar cuenta</Typography>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack
                alignItems="flex-start"
                spacing={3}
              >
                <Typography variant="subtitle1">
                  Elimina tu cuenta y todos tus datos de origen. Esto es irreversible.
                </Typography>
                <Button
                  color="error"
                  onClick={handleConfirm}
                  variant="outlined"
                >
                  Eliminar cuenta
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};

AccountGeneralSettings.propTypes = {
  avatar: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
};
