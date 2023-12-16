import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Button,
  Pressable,
} from "react-native";

interface ItemProps {
  item: any;
}

const MINUTE_MS = 1000 * 60 * 30;

const AgendaItem = (props: ItemProps) => {
  const [checkIn, setCheckIn] = useState(false);
  const [checkOut, setCheckOut] = useState(false);
  const { item } = props;
  //TODO: pass in job starting date and ending date
  const endDate = new Date("2024-10-10T00:00:00");

  const buttonPressed = useCallback(() => {
    Alert.alert("Passcode: ");
  }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(item.title);
  }, []);

  if (Object.keys(item).length === 0) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  useEffect(() => {
    if (new Date() <= endDate) return;

    const interval = setInterval(() => {
      console.log("Logs every 30 minutes");
      // TODO: firebase notification
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <Pressable onPress={itemPressed} style={styles.item}>
      <View>
        <Text style={styles.itemHourText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.duration}</Text>
      </View>
      <Text style={styles.itemTitleText}>{item.title}</Text>
      <View style={styles.itemButtonContainer}>
        <Button
          color={"grey"}
          title={`${checkOut ? "已完成" : checkIn ? "FINISH" : "簽到"}`}
          onPress={buttonPressed}
        />
      </View>
    </Pressable>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
  },
  itemHourText: {
    color: "black",
  },
  itemDurationText: {
    color: "grey",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: "black",
    marginLeft: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  emptyItemText: {
    color: "lightgrey",
    fontSize: 14,
  },
});
