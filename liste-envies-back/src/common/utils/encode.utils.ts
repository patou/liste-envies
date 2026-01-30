/**
 * Encode en base64 les textes pour empêcher de les lire dans la base de données
 * Port de EncodeUtils.java
 */
export class EncodeUtils {
  /**
   * Encode une chaîne en Base64
   * @param str - La chaîne à encoder
   * @param shouldEncode - Si false, retourne la chaîne non encodée
   * @returns La chaîne encodée ou null
   */
  static encode(
    str: string | null | undefined,
    shouldEncode = true,
  ): string | null {
    if (!shouldEncode) {
      return str || null;
    }
    if (str != null && str !== undefined) {
      return Buffer.from(str, 'utf-8').toString('base64');
    }
    return null;
  }

  /**
   * Décode une chaîne depuis Base64
   * @param str - La chaîne encodée à décoder
   * @param shouldDecode - Si false, retourne la chaîne non décodée
   * @returns La chaîne décodée ou null
   */
  static decode(
    str: string | null | undefined,
    shouldDecode = true,
  ): string | null {
    if (!shouldDecode) {
      return str || null;
    }
    if (str != null && str !== undefined) {
      try {
        return Buffer.from(str, 'base64').toString('utf-8');
      } catch (error) {
        // En cas d'erreur de décodage, retourner la chaîne originale
        return str;
      }
    }
    return null;
  }
}
