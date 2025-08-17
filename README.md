SIMPLE CALENDAR
---------------
Componente de calendario para utilizar dentro de un modal, y poder así seleccionar fechas de forma sencilla.

Tanto los parámetros de fecha inicial, fecha mínima, y fecha máxima, como así también el valor de la fecha seleccionada, son un String con el formato "AAAA-MM-DD"

Descripción de los parámetros y de la función onSelect:
 - initialDate: Opcional. String con formato "AAAA-MM-DD". Por defecto es la fecha actual,
 - minDate: Opcional. String con formato "AAAA-MM-DD". Por defecto son 50 años (año completo, no calendario) antes de initialDate.
 - maxDate: Opcional. String con formato "AAAA-MM-DD". Por defecto son 50 años (año completo, no calendario) después de initialDate.
 - onSelect: Función que se va a ejecutar al seleccionar una fecha.
   Ingresa como parámetro en la función la fecha seleccionada en formato String tipo "AAAA-MM-DD".
   Ej: onSelect={(fecha) => {
              console.log(`fecha seleccionada ${fecha}`);
            }} // log --> fecha seleccionada 2025-08-16

Ejemplo de app en la que se implementa el componente:

import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import SimpleCalendar from "./Calendar";

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [fechaElegida, setFechaElegida] = useState("Seleccionar fecha");
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <SimpleCalendar
            minDate={"2020-08-11"}
            maxDate={"2030-08-30"}
            onSelect={(fecha) => {
              console.log(`fecha seleccionada ${fecha}`);
              setFechaElegida(fecha);
              setModalVisible(false);
            }}
          />
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={{ marginVertical: 20 }}>MODAL ON</Text>
      </TouchableOpacity>
      <Text style={{ marginVertical: 20 }}>{fechaElegida}</Text>
    </View>
  );
}
