const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.post("/reservas", controller.crearReserva);

router.get("/reservas", controller.obtenerReserva);

router.get("/reservas/:id", controller.obtenerReserva);

router.put("/reservas/:id", controller.actualizarReserva);

router.delete("/reservas/:id", controller.eliminarReserva);

router.get(
  "/reservas/consulta-mes-siguiente/filtro",
  controller.filtrarReservasMesSiguiente
);

router.get("/reservas/buscar/fecha", controller.buscarPorFecha);

router.get("/reservas/tipo/habitacion", controller.filtrarPorHabitacion);

router.get("/reservas/filtro/pagado", controller.filtrarPorPago);

router.get("/reservas/huespedes/mayorque", controller.filtrarCantidadHuespedes);

module.exports = router;
