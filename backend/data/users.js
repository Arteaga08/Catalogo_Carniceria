//Creacion de cuentas y sus permisos.
const users = [
  {
    name: 'Administrador Principal',
    email: 'admin@example.com',
    password: '123456', // Se cifrará automáticamente por el middleware en UserModel.js
    role: 'admin',
  },
  {
    name: 'Editor de Productos',
    email: 'editor@example.com',
    password: '123456', // También se cifrará
    role: 'editor',
  },
  // Puedes añadir más usuarios aquí si lo deseas
];

export default users;