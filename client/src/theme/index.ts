import { extendTheme } from "@chakra-ui/react";
import components from "./components";
import styles from "./styles"

const overrides = {
    ...styles,
    ...components
}

export default extendTheme(overrides)