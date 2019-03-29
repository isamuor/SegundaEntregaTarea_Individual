const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser')
const funciones = require('./funciones');
require('./helpers')

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');
const dirNode_modules = path.join(__dirname, '../node_modules')

app.use(express.static(directoriopublico));
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({
    extended: false
}))

app.set('view engine', 'hbs');

app.get('/', (req, res) => res.render('index'));


app.post('/formularioCrear', (req, res) => {
    infoCursos = funciones.mostrar();
    res.render('formularioCrear', {
        TablaCursos: infoCursos[0],
    });

})

app.post('/crear', (req, res) => {
    curso = {
        nombre: req.body.nombre,
        id: req.body.id,
        valor: req.body.valor,
        descripcion: req.body.descripcion,
        modalidad: req.body.modalidad,
        intensidad: req.body.intensidad
    };
    mensaje = funciones.crear(curso);
    if (mensaje[0] == '1') {
        texto = `<div class = 'alert-success'\
        role = 'alert'> <h4 class="alert-heading"> <br> ${mensaje[1]} </h4><hr></div>`
    } else {
        texto = `<div class = 'alert alert-danger'\
        role = 'alert'><h4 class="alert-heading"> <br> ${mensaje[1]} </h4><hr></div>`
    }
    infoCursos = funciones.mostrar();
    console.log(mensaje);
    res.render('crear', {
        texto,
        informacion: infoCursos[0],
    });
});

app.post('/ver', (req, res) => {
    infoCursos = funciones.mostrar();
    //console.log(infoCursos[1]);
    res.render('ver', {
        informacion: infoCursos[1],
    })
});

app.post('/inscribir', (req, res) => {
    Nombre_Cursos = funciones.mostrar_nombres_cursos();
    res.render('inscribir', {
        Nombre_Cursos
    })
});

app.post('/inscritos', (req, res) => {
    estudiante = {
        nombre: req.body.nombre,
        cedula: req.body.cedula,
        email: req.body.email,
        tel: req.body.tel,
        nombreCurso: req.body.nombreCurso,
    };
    mensaje = funciones.inscribir(estudiante);
    if (mensaje[0] == '1') {
        texto = `<div class = 'alert-success px-4'
        role = 'alert'> <h4 class="alert-heading"> <br> ${mensaje[1]} </h4><hr></div>`
        inscrito = mensaje[2];
    } else {
        texto = `<div class = 'alert alert-danger px-4'
        role = 'alert'><h4 class="alert-heading"> <br> ${mensaje[1]} </h4><hr></div>`
        inscrito = ` `;
    }
    res.render('inscritos', {
        texto,
        inscrito,
    });
});

app.post('/verInscritos', (req, res) => {

    cambia = req.body.gridRadios;

    if (!cambia) {
        infoCursos = funciones.mostrar_inscritos();
        res.render('verInscritos', {
            informacion: infoCursos,
        })
    } else {
        funciones.actualizarCursos(cambia, 'cerrado')
        infoCursos = funciones.mostrar_inscritos();
        res.render('verInscritos', {
            informacion: infoCursos,
        })

    }
});


app.post('/eliminarInscritos', (req, res) => {
    Nombre_Cursos = funciones.mostrar_nombres_cursos();
    res.render('eliminarInscritos', {
        Nombre_Cursos,
    })
});

app.post('/eliminado', (req, res) => {
    idElimina = req.body.id;
    cursoElimina = req.body.nombreCurso;
    let texto = funciones.eliminarInscritos(cursoElimina, idElimina);
    res.render('eliminado', {
        mensaje: texto[0],
        permanecenInscritos: texto[1],
    })
});

app.get('*', (req, res) => res.render('error'));


app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
})