let idReservaInicial = 2000;

const tiposDeHabitacion = ["simple", "doble", "familiar", "lujo"];

let reservasGuardadas = [
  {
    id: 1,
    tipo: "lujo",
    reserva: {
      inicio: "2024/09/18",
      fin: "2024/09/18",
    },
    adultos: 3,
    ninos: 2,
    pagado: true,
    hotel: "paraiso",
  },
  {
    id: 2,
    tipo: "simple",
    reserva: {
      inicio: "2024/10/03",
      fin: "2024/11/05",
    },
    adultos: 3,
    ninos: 2,
    pagado: false,
    hotel: "paraiso",
  },
  {
    id: 3,
    tipo: "simple",
    reserva: {
      inicio: "2024/12/23",
      fin: "2024/12/26",
    },
    adultos: 3,
    ninos: 2,
    pagado: true,
    hotel: "poas",
  },
];
// Como viajero, quiero hacer una reserva en el hotel "Hotel Paraíso" para el 15 de mayo de 2023. Necesito una habitación doble para dos adultos y un niño.
exports.crearReserva = (req, res) => {
  const data = req.body;
  idReservaInicial++;
  if (!tiposDeHabitacion.includes(data.tipo)) {
    res.send(
      "Tipo invalido, los tipos aceptados son: " + tiposDeHabitacion.toString()
    );
    return;
  }
  const nuevaReserva = {
    id: idReservaInicial,
    tipo: data.tipo,
    reserva: {
      inicio: data.inicio,
      fin: data.fin,
    },
    adultos: parseInt(data.adultos),
    ninos: parseInt(data.ninos),
    pagado: data.pagado,
    hotel: data.hotel,
  };
  reservasGuardadas.push(nuevaReserva);

  res.json({ message: "Creado con exito", nuevaReserva });
};

// Como recepcionista, necesito verificar los detalles de la reserva del huésped que acaba de llegar al hotel. Su número de reserva es 12345.
exports.obtenerReserva = (req, res) => {
  const data = parseInt(req.params.id);
  const reserva = reservasGuardadas.find(
    (elementoActual) => elementoActual.id == data
  );
  if (!reserva) {
    res.send("Numero de reserva invalido");
    return;
  }
  res.json({ reserva });
};
// Como huésped, necesito cambiar mi reserva en el hotel "Hotel Paraíso". Originalmente reservé una habitación doble, pero ahora necesito una suite familiar. Mi número de reserva es 12345.
exports.actualizarReserva = (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  if (!existeId(id)) {
    res.json({ message: "Reserva no existe" });
    return;
  }
  if (!tiposDeHabitacion.includes(data.tipo)) {
    res.send(
      "Tipo invalido, los tipos aceptados son: " + tiposDeHabitacion.toString()
    );
    return;
  }
  reservasGuardadas = reservasGuardadas.filter((reserva) => reserva.id !== id);
  const reservaActualizada = {
    id,
    tipo: data.tipo,
    reserva: {
      inicio: data.inicio,
      fin: data.fin,
    },
    adultos: parseInt(data.adultos),
    ninos: parseInt(data.ninos),
    pagado: data.pagado,
    hotel: data.hotel,
  };
  reservasGuardadas.push(reservaActualizada);

  res.json({ message: "actualizado con exito", reservaActualizada });
};

// como viajero, tuve un cambio de planes y ya no necesito la habitación que reservé en el hotel "hotel paraíso". mi número de reserva es 12345.
exports.eliminarReserva = (req, res) => {
  const id = parseInt(req.params.id);

  if (!existeId(id)) {
    res.json({ message: "Reserva no existe" });
    return;
  }
  reservasGuardadas = reservasGuardadas.filter((reserva) => reserva.id !== id);

  res.json({ message: "Eliminado con exito" });
};

// como gerente de una cadena de hoteles, quiero ver todas las reservas para el "hotel paraíso" para el próximo mes.
exports.filtrarReservasMesSiguiente = (req, res) => {
  const hotel = req.query.hotel;
  console.log(hotel);
  const fechas = obtenerInicioYFinDeMesSiguiente();
  const reservas = obtenerReservasPorRangoDeFecha(hotel, fechas);

  res.json({ message: "reservas mes siguiente", reservas });
};
// como gerente del hotel, quiero ver todas las reservas para la semana de navidad para poder planificar el personal y las actividades necesarias.
// Como gerente del hotel, quiero ver una lista de todas las reservas para hoy para poder planificar el trabajo del personal de limpieza y recepción.
exports.buscarPorFecha = (req, res) => {
  const data = req.query;
  const fechas = {
    inicio: data.inicio,
    fin: data.fin,
  };
  const reservas = obtenerReservasPorRangoDeFecha(data.hotel, fechas);

  res.json({ message: "Reservas en este rango de fechas", reservas });
};

// como gerente del hotel, quiero ver todas las reservas para nuestras suites de lujo para el próximo mes para asegurarme de que todo esté en perfectas condiciones para nuestros huéspedes vip.
exports.filtrarPorHabitacion = (req, res) => {
  const data = req.query;
  const reservas = reservasGuardadas.filter(
    (reserva) => reserva.tipo === data.habitacion
  );
  res.json({ message: "Reservas de tipo: " + data.habitacion, reservas });
};
// como gerente del hotel, quiero ver todas las reservas que están pendientes de pago para poder hacer un seguimiento con los clientes.
exports.filtrarPorPago = (req, res) => {
  const data = req.query;
  console.log(data);
  const reservas = reservasGuardadas.filter(
    (reserva) => String(reserva.pagado) == data.pagado
  );
  res.json({
    message: `reservas ${
      data.pagado === "true" ? "pagadas" : "pendientes de pago"
    }`,
    reservas,
  });
};
// como gerente del hotel, quiero ver todas las reservas para grupos de más de 5 personas para el próximo mes, para poder planificar las necesidades adicionales de estos grupos grandes.
exports.filtrarCantidadHuespedes = (req, res) => {
  const data = req.query;
  const reservas = reservasGuardadas.filter(
    (reserva) => reserva.ninos + reserva.adultos > data.huespedes
  );
  res.json({
    message: "reservas con mas de " + data.huespedes + " huespedes",
    reservas,
  });
};

function obtenerReservasPorRangoDeFecha(hotel, fechas) {
  return reservasGuardadas.filter((actual) => {
    if (actual.hotel !== hotel) {
      return false;
    }
    return rangoDeFecha(
      fechas.inicio,
      fechas.fin,
      actual.reserva.inicio,
      actual.reserva.fin
    );
  });
}

function existeId(id) {
  return reservasGuardadas.some((elementoActual) => elementoActual.id == id);
}

function mesSiguiente() {
  const fechaActual = new Date();

  const fechaConUnMesSumado = new Date(fechaActual);
  fechaConUnMesSumado.setMonth(fechaConUnMesSumado.getMonth() + 1);

  return fechaConUnMesSumado;
}

function rangoDeFecha(inicio1, fin1, inicio2, fin2) {
  const inicio = new Date(inicio1);
  const fin = new Date(fin1);
  const inicioReserva = new Date(inicio2);
  const finReserva = new Date(fin2);

  return inicio <= finReserva && fin >= inicioReserva;
}

function obtenerInicioYFinDeMesSiguiente() {
  let fechaInicio = new Date(mesSiguiente().setHours(0, 0, 0, 0));
  let fechaFin = mesSiguiente();

  fechaInicio.setDate(1);
  fechaFin.setDate(
    ultimoDiaDelMes(fechaFin.getMonth(), fechaFin.getFullYear())
  );
  return { inicio: formatearFecha(fechaInicio), fin: formatearFecha(fechaFin) };
}
function ultimoDiaDelMes(mes, año) {
  return new Date(año, mes + 1, 0).getDate();
}

function formatearFecha(fecha) {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${año}/${mes}/${dia}`;
}
