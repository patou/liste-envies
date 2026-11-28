import { Component, Input } from "@angular/core";

@Component({
  selector: "app-avatar",
  imports: [],
  template: `
    <div
      class="avatar"
      [class.round]="round"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.font-size.px]="size / 2"
    >
      @if (imageUrl && !imageFailed) {
      <img [src]="imageUrl" [alt]="name" (error)="imageFailed = true" />
      } @else {
      <span class="initials">{{ initials }}</span>
      }
    </div>
  `,
  styles: [
    `
      /* Aligne tous les avatars sur le texte voisin (liste, en-tete, envie) : centre vertical + espace avant/apres */
      :host {
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        flex: 0 0 auto;
        margin-inline: 4px;
      }
      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #4caf50;
        color: white;
        font-weight: bold;
        overflow: hidden;
        text-transform: uppercase;
      }
      .avatar.round {
        border-radius: 50%;
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .avatar .initials {
        font-size: inherit;
      }
    `
  ]
})
export class AvatarComponent {
  @Input() name: string = "";
  @Input() gravatarId: string = "";
  @Input() src: string = "";
  @Input() size: number = 40;
  @Input() round: boolean = false;
  imageFailed = false;

  get imageUrl(): string {
    if (this.src) {
      return this.src;
    }
    if (this.gravatarId) {
      return `https://www.gravatar.com/avatar/${this.md5(
        this.gravatarId
      )}?d=identicon&s=${this.size}`;
    }
    return "";
  }

  get initials(): string {
    if (!this.name) return "?";
    const parts = this.name.split(" ");
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    }
    return this.name.substring(0, 2);
  }

  // MD5 requis par Gravatar (hash de l'email en minuscules)
  private md5(str: string): string {
    const k: number[] = [];
    for (let i = 0; i < 64; i++) {
      k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
    }
    const r = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
    const bytes = Array.from(new TextEncoder().encode(str.toLowerCase().trim()));
    const len = bytes.length;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) {
      bytes.push(0);
    }
    const bits = len * 8;
    for (let i = 0; i < 8; i++) {
      bytes.push(i < 4 ? (bits >>> (8 * i)) & 0xff : 0);
    }
    let a0 = 0x67452301;
    let b0 = 0xefcdab89 | 0;
    let c0 = 0x98badcfe | 0;
    let d0 = 0x10325476;
    for (let o = 0; o < bytes.length; o += 64) {
      const m: number[] = [];
      for (let i = 0; i < 16; i++) {
        m[i] =
          bytes[o + i * 4] |
          (bytes[o + i * 4 + 1] << 8) |
          (bytes[o + i * 4 + 2] << 16) |
          (bytes[o + i * 4 + 3] << 24);
      }
      let a = a0;
      let b = b0;
      let c = c0;
      let d = d0;
      for (let i = 0; i < 64; i++) {
        let f: number;
        let g: number;
        if (i < 16) {
          f = (b & c) | (~b & d);
          g = i;
        } else if (i < 32) {
          f = (d & b) | (~d & c);
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          f = b ^ c ^ d;
          g = (3 * i + 5) % 16;
        } else {
          f = c ^ (b | ~d);
          g = (7 * i) % 16;
        }
        const tmp = d;
        d = c;
        c = b;
        const x = (a + f + k[i] + m[g]) | 0;
        const s = r[(i >> 4) * 4 + (i % 4)];
        b = (b + ((x << s) | (x >>> (32 - s)))) | 0;
        a = tmp;
      }
      a0 = (a0 + a) | 0;
      b0 = (b0 + b) | 0;
      c0 = (c0 + c) | 0;
      d0 = (d0 + d) | 0;
    }
    return [a0, b0, c0, d0]
      .map((v) =>
        [0, 8, 16, 24]
          .map((sh) => ((v >>> sh) & 0xff).toString(16).padStart(2, "0"))
          .join("")
      )
      .join("");
  }
}
