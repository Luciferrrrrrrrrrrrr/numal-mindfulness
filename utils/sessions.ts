// utils/session.ts

import { ImageSourcePropType } from "react-native";

 interface Session {
  id: number;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

export const sessions: Session[] = [
  {
    id: 1,
    title: "Forest View",
    description: "A quiet forest path inviting stillness and calm awareness.",
    image: require("../assets/sessions/forest-view.png"),
  },
  {
    id: 2,
    title: "Mountain Path",
    description: "A peaceful trail through the mountains, steady and grounding.",
    image: require("../assets/sessions/mountain-path.png"),
  },
  {
    id: 3,
    title: "Ocean Waves",
    description: "Gentle ocean waves flowing in a steady, soothing rhythm.",
    image: require("../assets/sessions/ocean-waves.png"),
  },
  {
    id: 4,
    title: "Sunrise Sky",
    description: "Soft sunrise colors welcoming a new beginning.",
    image: require("../assets/sessions/sunrise-sky.png"),
  },
  {
    id: 5,
    title: "Zen Stones",
    description: "Balanced stones symbolizing calm, focus, and inner stability.",
    image: require("../assets/sessions/zen-stones.png"),
  },
];
