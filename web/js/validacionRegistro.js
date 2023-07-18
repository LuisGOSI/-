var nombreInput = document.getElementById('nombre');
        var apellidoInput = document.getElementById('apellido');
        var correoInput = document.getElementById('correo');
        var contraseñaInput = document.getElementById('contraseña');
        var confirmarContraseñaInput = document.getElementById('confirmar_contraseña');
        var botonRegistrar = document.getElementById('boton-registrar');

        function validarFormulario() {
            // Obtener los valores para la validacion
            var nombre = nombreInput.value;
            var apellido = apellidoInput.value;
            var correo = correoInput.value;
            var contraseña = contraseñaInput.value;
            var confirmarContraseña = confirmarContraseñaInput.value;

            // Validar que los campos no estén vacíos
            if (nombre === '') {
                document.getElementById('errornombre').innerHTML = 'Debe ingresar un nombre';
                return;
            } else {
                document.getElementById('errornombre').innerHTML = '';
            }

            if (apellido === '') {
                document.getElementById('errorapellido').innerHTML = 'Debe ingresar un apellido';
                return;
            } else {
                document.getElementById('errorapellido').innerHTML = '';
            }

            if (correo === '') {
                document.getElementById('errorcorreo').innerHTML = 'Debe ingresar un correo';
                return;
            } else {
                document.getElementById('errorcorreo').innerHTML = '';
            }

            if (contraseña === '') {
                document.getElementById('errorcontraseña').innerHTML = 'Debe ingresar una contraseña';
                return;
            } else {
                document.getElementById('errorcontraseña').innerHTML = '';
            }

            if (confirmarContraseña === '') {
                document.getElementById('errorconfirmar').innerHTML = 'Por favor, confirme su contraseña';
                return;
            } else {
                document.getElementById('errorconfirmar').innerHTML = '';
            }

            // Validar que las contraseñas coincidan
            if (contraseña !== confirmarContraseña) {
                alert('Las contraseñas no coinciden');
                return;
            }

            // Si todas las validaciones estan correctas, los manda directamente a la pagina de registro con exito
            window.location.href = 'registroExito';
        }

        // Función para habilitar o deshabilitar el botón "Registrar" según el estado de los campos
        function habilitarBotonRegistrar() {
            if (
                nombreInput.value !== '' &&
                apellidoInput.value !== '' &&
                correoInput.value !== '' &&
                contraseñaInput.value !== '' &&
                confirmarContraseñaInput.value !== ''
            ) {
                botonRegistrar.disabled = false;
            } else {
                botonRegistrar.disabled = true;
            }
        }

        //Aqui tenemos que agregar los eventos input para verificar el estado del campo
        nombreInput.addEventListener('input', habilitarBotonRegistrar);
        apellidoInput.addEventListener('input', habilitarBotonRegistrar);
        correoInput.addEventListener('input', habilitarBotonRegistrar);
        contraseñaInput.addEventListener('input', habilitarBotonRegistrar);
        confirmarContraseñaInput.addEventListener('input', habilitarBotonRegistrar);