import { Schema } from 'mongoose';

/**
 * Mongoose schema for Settings.
 *
 * This schema defines the structure for storing settings information in the database
 * as a part of the 'User' collection.
 * Each settings includes the following fields:
 * - `theme`: The name of the current theme. This field is required.
 * - `textSize`: The currently selected size of text. This field is required.
 * - `textBoldness`: The currently selected boldness of text. This field is required.
 * - `font`: The currently selected font style. This field is required.
 * - `lineSpacing`: The currently selected spacing of text. This field is required.
 * - 'backgroundColor': The currently selected background color for CustomTheme mode. This field is required.
 * - 'textColor': The currently selected text color for CustomTheme mode. This field is required.
 * - 'buttonColor': The currently selected button color for CustomTheme mode. This field is required.
 */
const settingsSchema: Schema = new Schema(
  {
    theme: {
      type: String,
    },
    textSize: {
      type: String,
    },
    textBoldness: {
      type: String,
    },
    font: {
      type: String,
    },
    lineSpacing: {
      type: String,
    },
    backgroundColor: {
      type: String,
    },
    textColor: {
      type: String,
    },
    buttonColor: {
      type: String,
    },
  },
  { collection: 'Setting' },
);

export default settingsSchema;
