import { Theme } from "./calendar";

export const themeColor = "#1f02f7";
export const lightThemeColor = "#f2f7f7";

export function getTheme() {
  const disabledColor = "black";

  return {
    // arrows
    arrowColor: "gray",
    arrowStyle: { padding: 0 },
    // knob
    expandableKnobColor: themeColor,
    // month
    monthTextColor: "black",
    textMonthFontSize: 16,
    textMonthFontFamily: "HelveticaNeue",
    textMonthFontWeight: "bold",
    // day names
    textSectionTitleColor: "black",
    textDayHeaderFontSize: 12,
    textDayHeaderFontFamily: "HelveticaNeue",
    textDayHeaderFontWeight: "normal",
    // dates
    dayTextColor: themeColor,
    todayTextColor: "#4c4c4d",
    textDayFontSize: 18,
    textDayFontFamily: "HelveticaNeue",
    textDayFontWeight: "500",
    // textDayStyle: { marginTop: Platform.OS === "android" ? 2 : 4 },
    // selected date
    selectedDayBackgroundColor: themeColor,
    selectedDayTextColor: "black",
    // disabled date
    textDisabledColor: disabledColor,
    // dot (marked date)
    dotColor: themeColor,
    selectedDotColor: "black",
    disabledDotColor: disabledColor,
    // dotStyle: { marginTop: -2 },
  } as Theme;
}

// export function getTheme() {
//   const disabledColor = "grey";

//   return {
//     // arrows
//     arrowColor: "black",
//     arrowStyle: { padding: 0 },
//     // knob
//     expandableKnobColor: themeColor,
//     // month
//     monthTextColor: "black",
//     textMonthFontSize: 16,
//     textMonthFontFamily: "HelveticaNeue",
//     textMonthFontWeight: "bold" as const,
//     // day names
//     textSectionTitleColor: "black",
//     textDayHeaderFontSize: 12,
//     textDayHeaderFontFamily: "HelveticaNeue",
//     textDayHeaderFontWeight: "normal" as const,
//     // dates
//     dayTextColor: themeColor,
//     todayTextColor: "#af0078",
//     textDayFontSize: 18,
//     textDayFontFamily: "HelveticaNeue",
//     textDayFontWeight: "500" as const,
//     // textDayStyle: { marginTop: Platform.OS === "android" ? 2 : 4 },
//     // selected date
//     selectedDayBackgroundColor: themeColor,
//     selectedDayTextColor: "white",
//     // disabled date
//     textDisabledColor: disabledColor,
//     // dot (marked date)
//     dotColor: themeColor,
//     selectedDotColor: "white",
//     disabledDotColor: disabledColor,
//     // dotStyle: { marginTop: -2 },
//   };
// }
