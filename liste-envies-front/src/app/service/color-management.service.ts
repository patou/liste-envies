import { Injectable } from "@angular/core";
// @ts-ignore
import Vibrant from "node-vibrant";
import { Palette } from "node-vibrant/lib/color";

declare const tinycolor: any;

export interface Color {
  name: string;
  hex: string;
  darkContrast: boolean;
}

@Injectable({
  providedIn: "root"
})
export class ColorManagementService {
  private primary: string = "#0288d1";
  private accent: string = "#03a9f4";

  constructor() {
    this.applyDefaultColor();
  }

  applyDefaultColor() {
    this.setColors(this.primary, this.accent);
  }

  setColors(primary, accent) {
    this._applyColor("primary", primary);
    this._applyColor("accent", accent);
  }

  setColorFromUrl(url: string) {
    // Using builder
    Vibrant.from(url, { quality: 1 })
      .getPalette()
      .then(
        palette => {
          if (palette && palette.Muted && palette.Vibrant) {
            this.setColors(
              palette.DarkMuted.getHex(),
              palette.Vibrant.getHex()
            );
          } else {
            this.applyDefaultColor();
          }
        },
        () => {
          this.applyDefaultColor();
        }
      );
  }

  private _applyColor(type: string, color: string) {
    const colorPalette = this._computeColors(color);

    for (const colorDeclinaison of colorPalette) {
      const key1 = `--theme-${type}-${colorDeclinaison.name}`;
      const value1 = colorDeclinaison.hex;
      const key2 = `--theme-${type}-contrast-${colorDeclinaison.name}`;
      const value2 = colorDeclinaison.darkContrast
        ? "rgba(black, 0.87)"
        : "white";
      document.documentElement.style.setProperty(key1, value1);
      document.documentElement.style.setProperty(key2, value2);
    }
  }

  private _computeColors(hex: string): Color[] {
    return [
      this._getColorObject(tinycolor(hex).lighten(52), "50"),
      this._getColorObject(tinycolor(hex).lighten(37), "100"),
      this._getColorObject(tinycolor(hex).lighten(26), "200"),
      this._getColorObject(tinycolor(hex).lighten(12), "300"),
      this._getColorObject(tinycolor(hex).lighten(6), "400"),
      this._getColorObject(tinycolor(hex), "500"),
      this._getColorObject(tinycolor(hex).darken(6), "600"),
      this._getColorObject(tinycolor(hex).darken(12), "700"),
      this._getColorObject(tinycolor(hex).darken(18), "800"),
      this._getColorObject(tinycolor(hex).darken(24), "900"),
      this._getColorObject(tinycolor(hex).lighten(50).saturate(30), "A100"),
      this._getColorObject(tinycolor(hex).lighten(30).saturate(30), "A200"),
      this._getColorObject(tinycolor(hex).lighten(10).saturate(15), "A400"),
      this._getColorObject(tinycolor(hex).lighten(5).saturate(5), "A700")
    ];
  }

  private _getColorObject(value, name): Color {
    const c = tinycolor(value);
    return {
      name: name,
      hex: c.toHexString(),
      darkContrast: c.isLight()
    };
  }
}
