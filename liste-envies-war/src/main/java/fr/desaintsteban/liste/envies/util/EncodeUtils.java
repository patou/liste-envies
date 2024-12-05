package fr.desaintsteban.liste.envies.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Encode en base64 les textes pour empêcher de les lire dans la base de donnée
 */
public class EncodeUtils {

    public static String encode(String string, boolean encode) {
        return encode ? encode(string) : string;
    }

    public static String encode(String string) {
        if (string != null) {
            byte[] message = string.getBytes(StandardCharsets.UTF_8);
            return Base64.getEncoder().encodeToString(message);
        }
        return null;
    }

    public static String decode(String string, boolean decode) {
        return decode ? decode(string) : string;
    }

    public static String decode(String string) {
        if (string != null) {
            byte[] decoded = Base64.getDecoder().decode(string);
            return new String(decoded, StandardCharsets.UTF_8);
        }
        return null;
    }
}
