// SIMPLE CALENDAR
// ---------------
// Componente de calendario para utilizar dentro de un modal, y poder así seleccionar fechas de forma sencilla.

// Tanto los parámetros de fecha inicial, fecha mínima, y fecha máxima, como así también el valor de la fecha seleccionada, son un String con el formato "AAAA-MM-DD"

// Descripción de los parámetros y de la función onSelect:
//  - initialDate: Opcional. String con formato "AAAA-MM-DD". Por defecto es la fecha actual,
//  - minDate: Opcional. String con formato "AAAA-MM-DD". Por defecto son 50 años (año completo, no calendario) antes de initialDate.
//  - maxDate: Opcional. String con formato "AAAA-MM-DD". Por defecto son 50 años (año completo, no calendario) después de initialDate.
//  - onSelect: Función que se va a ejecutar al seleccionar una fecha.
//    Ingresa como parámetro en la función la fecha seleccionada en formato String tipo "AAAA-MM-DD".
//    Ej: onSelect={(fecha) => {
//               console.log(`fecha seleccionada ${fecha}`);
//             }} // log --> fecha seleccionada 2025-08-16

// Ejemplo de app en la que se implementa el componente:

// import { useState } from "react";
// import { Modal, Text, TouchableOpacity, View } from "react-native";
// import SimpleCalendar from "./Calendar";

// export default function Index() {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [fechaElegida, setFechaElegida] = useState("Seleccionar fecha");
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View
//           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
//         >
//           <SimpleCalendar
//             minDate={"2020-08-11"}
//             maxDate={"2030-08-30"}
//             onSelect={(fecha) => {
//               console.log(`fecha seleccionada ${fecha}`);
//               setFechaElegida(fecha);
//               setModalVisible(false);
//             }}
//           />
//         </View>
//       </Modal>
//       <TouchableOpacity onPress={() => setModalVisible(true)}>
//         <Text style={{ marginVertical: 20 }}>MODAL ON</Text>
//       </TouchableOpacity>
//       <Text style={{ marginVertical: 20 }}>{fechaElegida}</Text>
//     </View>
//   );
// }

import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Componente que renderiza un calendario. Está pensado para funcionar dentro de un Modal sin la utilización de ninguna dependencia de terceros.
 * Tanto los parámetros de fecha inicial, fecha mínima, y fecha máxima, como así también el valor de la fecha seleccionada, son un String con el formato "AAAA-MM-DD".
 * @param {String} initialDate Opcional. String con formato "AAAA-MM-DD". Por defecto es la fecha actual.
 * @param {String} minDate Opcional. String con formato "AAAA-MM-DD". Por defecto son 50 años (año completo, no calendario) antes de initialDate.
 * @param {String} maxDate Opcional. String con formato "AAAA-MM-DD". Por defecto son 50 años (año completo, no calendario) después de initialDate.
 * @param {Function} onSelect Función que se va a ejecutar al seleccionar una fecha. Ingresa como parámetro en la función la fecha seleccionada en formato String tipo "AAAA-MM-DD".
 * Ej: onSelect={(fecha) => {
              console.log(`fecha seleccionada ${fecha}`);
            }} // log --> fecha seleccionada 2025-08-16
 */
export default function SimpleCalendar({
  // Ahora se puede pasar también un string "AAAA-MM-DD"
  initialDate = new Date(),
  minDate,
  maxDate,
  onSelect = () => {},
}) {
  // Caracteres con las flechas para seleccionar meses/años
  const flecha_flechaComillas_Anterior = "\u2039";
  const flecha_flechaComillas_Siguiente = "\u203A";
  const flecha_dobleFechaComillas_Anterior = "\u00AB";
  const flecha_dobleFechaComillas_Siguiente = "\u00BB";
  const flecha_flechaComun_Anterior = "\u2190";
  const flecha_flechaComun_Siguiente = "\u2192";

  const flechaAnterior = flecha_dobleFechaComillas_Anterior;
  const flechaSiguiente = flecha_dobleFechaComillas_Siguiente;

  // Parse "AAAA-MM-DD" a Date
  const parseDateString = (str) => {
    if (!str) return null;
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  // Si initialDate es string, lo convierto
  let initialDateObj;
  if (typeof initialDate === "string") {
    initialDateObj = parseDateString(initialDate);
  } else if (initialDate instanceof Date) {
    initialDateObj = initialDate;
  } else {
    initialDateObj = new Date();
  }

  // Para formatear Date a string
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // min/max en Date
  const minDateObj = parseDateString(minDate);
  const maxDateObj = parseDateString(maxDate);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(initialDateObj.getFullYear(), initialDateObj.getMonth(), 1)
  );
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState("days"); // 'days' | 'months' | 'years'

  const isSameDate = (d1, d2) =>
    d1 &&
    d2 &&
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isDateDisabled = (date) => {
    if (minDateObj && date < minDateObj) return true;
    if (maxDateObj && date > maxDateObj) return true;
    return false;
  };

  const today = new Date();

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const prevMonthDisabled = () => {
    const prev = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const lastDayPrev = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);
    return minDateObj && lastDayPrev < minDateObj;
  };
  const nextMonthDisabled = () => {
    const next = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    return maxDateObj && next > maxDateObj;
  };

  const selectDate = (date) => {
    setSelected(date);
    onSelect(formatDate(date)); // Devuelvo string al padre
  };

  const buildCalendar = () => {
    const startDay = currentMonth.getDay(); // 0 domingo
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    const weeks = [];
    let week = [];

    for (let i = 0; i < startDay; i++) week.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      );
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    while (week.length > 0 && week.length < 7) {
      week.push(null);
    }
    if (week.length === 7) weeks.push(week);

    while (weeks.length < 6) {
      weeks.push(new Array(7).fill(null));
    }
    return weeks;
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const renderMonths = () => (
    <View style={styles.monthsContainer}>
      {monthNames.map((m, idx) => {
        const tempDate = new Date(currentMonth.getFullYear(), idx, 1);
        const disabled =
          (minDateObj &&
            new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0) <
              minDateObj) ||
          (maxDateObj && tempDate > maxDateObj);

        return (
          <TouchableOpacity
            key={m}
            style={[styles.monthButton, disabled && { opacity: 0.25 }]}
            disabled={disabled}
            onPress={() => {
              setCurrentMonth(tempDate);
              setViewMode("days");
            }}
          >
            <Text>{m}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderYears = () => {
    const startYear = minDateObj
      ? minDateObj.getFullYear()
      : currentMonth.getFullYear() - 50;
    const endYear = maxDateObj
      ? maxDateObj.getFullYear()
      : currentMonth.getFullYear() + 50;
    const years = [];
    for (let y = startYear; y <= endYear; y++) years.push(y);

    return (
      <ScrollView style={{ maxHeight: 250 }}>
        {years.map((y) => (
          <TouchableOpacity
            key={y}
            style={styles.yearButton}
            onPress={() => {
              setCurrentMonth(new Date(y, currentMonth.getMonth(), 1));
              setViewMode("months");
            }}
          >
            <Text>{y}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const prevYear = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1)
    );
  };
  const nextYear = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1)
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {viewMode !== "years" && (
          <TouchableOpacity
            onPress={viewMode === "months" ? prevYear : prevMonth}
            disabled={
              viewMode === "days"
                ? prevMonthDisabled()
                : viewMode === "months"
                ? false
                : true
            }
            style={styles.arrowArea}
          >
            <Text
              style={[
                styles.navText,
                viewMode === "days" && prevMonthDisabled() && styles.disabled,
              ]}
            >
              {flechaAnterior}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() =>
            setViewMode(
              viewMode === "days"
                ? "months"
                : viewMode === "months"
                ? "years"
                : "years"
            )
          }
        >
          {viewMode === "days" && (
            <Text style={styles.monthText}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
          )}
          {viewMode === "months" && (
            <Text style={styles.monthText}>{currentMonth.getFullYear()}</Text>
          )}
          {viewMode === "years" && (
            <Text style={styles.monthText}>Elegir año</Text>
          )}
        </TouchableOpacity>

        {viewMode !== "years" && (
          <TouchableOpacity
            onPress={viewMode === "months" ? nextYear : nextMonth}
            disabled={
              viewMode === "days"
                ? nextMonthDisabled()
                : viewMode === "months"
                ? false
                : true
            }
            style={styles.arrowArea}
          >
            <Text
              style={[
                styles.navText,
                viewMode === "days" && nextMonthDisabled() && styles.disabled,
              ]}
            >
              {flechaSiguiente}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Body */}
      {viewMode === "days" && (
        <>
          <View style={styles.weekRow}>
            {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
              <Text key={i} style={styles.weekDay}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.fixedHeight}>
            {buildCalendar().map((week, idx) => (
              <View key={idx} style={styles.weekRow}>
                {week.map((date, i) =>
                  date ? (
                    <TouchableOpacity
                      key={i}
                      onPress={() => selectDate(date)}
                      disabled={isDateDisabled(date)}
                      style={[
                        styles.dayCell,
                        isDateDisabled(date) && { opacity: 0.25 },
                        isSameDate(date, today) && styles.todayBorder,
                        isSameDate(date, selected) && styles.selectedDay,
                      ]}
                    >
                      <Text
                        style={
                          isSameDate(date, selected)
                            ? styles.selectedText
                            : styles.dayText
                        }
                      >
                        {date.getDate()}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View key={i} style={styles.dayCell} />
                  )
                )}
              </View>
            ))}
          </View>
        </>
      )}

      {viewMode === "months" && renderMonths()}
      {viewMode === "years" && renderYears()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  navText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  arrowArea: {
    padding: 10,
  },
  disabled: {
    opacity: 0.25,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 4,
  },
  weekDay: {
    width: 34,
    textAlign: "center",
    fontWeight: "bold",
    color: "#555",
  },
  fixedHeight: {
    height: 6 * 40,
    justifyContent: "space-between",
  },
  dayCell: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
    borderRadius: 17,
  },
  dayText: {
    color: "#333",
  },
  todayBorder: {
    borderWidth: 1,
    borderColor: "#999",
  },
  selectedDay: {
    backgroundColor: "#3784ff",
    borderRadius: 17,
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
  monthsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  monthButton: {
    width: "40%",
    padding: 10,
    margin: 5,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  yearButton: {
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});
