export const HUE_ORANGE = 30;
export const HUE_RED = 0;
export const HUE_YELLOW = 60;
export const HUE_GREEN = 120;
export const HUE_CYAN = 180;
export const HUE_BLUE = 240;
export const HUE_PURPLE = 270;
export const HUE_MAGENTA = 300;

export const MIN_BRIGHTNESS = 10;
export const MID_BRIGHTNESS = 150;
export const MAX_BRIGHTNESS = 1000;
export const MIN_SATURATION = 10; //mostly just white
export const MID_SATURATION = 900;
export const MAX_SATURATION = 1000;
export const MIN_TEMPERATURE = 10; //orange-ish light
export const MID_TEMPERATURE = 100;
export const MAX_TEMPERATURE = 1000; //white light

export const DULL_ORANGE = {
  hue: HUE_ORANGE,
  saturation: MAX_SATURATION,
  brightness: MIN_BRIGHTNESS,
};
export const BRIGHT_ORANGE = {
  hue: HUE_ORANGE,
  saturation: MID_SATURATION,
  brightness: MAX_BRIGHTNESS,
};

export const DIM_WHITE = {
  temperature: MIN_TEMPERATURE,
  brightness: MIN_BRIGHTNESS,
};
export const MID_WHITE = {
  temperature: MID_TEMPERATURE,
  brightness: MID_BRIGHTNESS,
};
export const BRIGHT_WHITE = {
  temperature: MAX_TEMPERATURE,
  brightness: MAX_BRIGHTNESS,
};
