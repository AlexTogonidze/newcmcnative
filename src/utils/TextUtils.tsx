import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "./Colors";

export interface TextWithShowMore {
  text: string;
}

function TextWithShowMore(props: TextWithShowMore) {
  let [showMore, setShowMore] = useState<boolean>(
    props.text.length > 150 ? true : false
  );

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => setShowMore(!showMore)}>
      <Text numberOfLines={showMore ? 3 : 999} ellipsizeMode="tail">
        {props.text}
      </Text>
      {props.text.length > 150 && (
        <Text style={st.showMore}>{showMore ? "show more" : "show less"}</Text>
      )}
    </TouchableOpacity>
  );
}

const st = StyleSheet.create({
  showMore: {
    fontWeight: "bold",
    fontSize: 15
  }
});

export default TextWithShowMore;
