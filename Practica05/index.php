
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi primera página web en PHP - 250802</title>
</head>
<body>

    <?php
    // Declaración de variables
    $nombre = "Jesus Yahir Calderon Lopez";
    $carrera_estudia = "T.S.U. en Desarrollo de Software Multiplataforma";

    echo "<h1>Hola Mundo desde PHP!</h1>";

    echo "<h2>Estás usando la versión de PHP: " . phpversion() . "</h2>";
    ?>

    <hr>

    <?php
    echo "<h3>Mi nombre es: $nombre y estudio: $carrera_estudia</h3>";

    // Operaciones matemáticas
    $x = 10;
    $y = 5;
    $z = '3';

    echo "<h3>La suma de $x + $y es: " . ($x + $y) . "</h3>";
    echo "<h3>La suma de $x + $y + $z es: " . ($x + $y + $z) . "</h3>";

    // Función para multiplicar
    function multiplicar($a, $b)
    {
        $resultado = $a * $b;
        echo "<h4>La multiplicación de $a * $b es: $resultado</h4>";
        return $resultado;
    }

    $resultado = multiplicar(3, 3);
    echo "<h4>La multiplicación de 3 x 3 es: $resultado</h4>";

    $resultado = multiplicar($x, $y);
    echo "<h4>La multiplicación de $x x $y es: $resultado</h4>";

    $resultado = multiplicar(1250, 325);
    echo "<h4>La multiplicación de 1250 x 325 es: $resultado</h4>";

    echo "<hr>";

    // Variable estática
    function myTest()
    {
        static $w = 0;
        echo "$w <br>";
        $w++;
    }

    myTest();
    myTest();
    myTest();
    myTest();

    echo "<hr>";

    // Tipo de datos de las variables
    echo "<p>La variable <strong>nombre</strong> es de tipo:</p>";
    var_dump($nombre);

    echo "<p>La variable <strong>carrera_estudia</strong> es de tipo:</p>";
    var_dump($carrera_estudia);

    // Fecha de nacimiento
    $fecha_nacimiento = "2005-01-01";

    echo "<p>La variable <strong>fecha_nacimiento</strong> es de tipo:</p>";
    var_dump($fecha_nacimiento);

    // Calcular edad actual
    $fecha_hoy = new DateTime();
    $fecha_nacimiento_obj = new DateTime($fecha_nacimiento);

    $edad_actual = $fecha_hoy->diff($fecha_nacimiento_obj)->y;

    echo "<p>La edad actual es: $edad_actual años</p>";

    ?>

</body>
</html>
