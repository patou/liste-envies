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
      @if (imageUrl) {
      <img [src]="imageUrl" [alt]="name" />
      } @if (!imageUrl) {
      <span class="initials">{{ initials }}</span>
      }
    </div>
  `,
  styles: [
    `
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

  // Simplified MD5 for gravatar - in production, use a proper crypto library
  private md5(str: string): string {
    // For gravatar, we can use the email directly in many cases
    // This is a placeholder - ideally use @angular/common or a crypto library
    return str.toLowerCase().trim();
  }
}
