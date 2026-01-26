package fr.desaintsteban.liste.envies.util;

import java.util.Base64;
import java.nio.charset.StandardCharsets;

/**
 * Encode en base64 les textes pour empécher de les lires dans la base de donnée
 */
public class EncodeUtils {

    public static String encode(String string, boolean encode) {
        return encode ? encode(string) : string;
    }

    public static String encode(String string) {
        if (string != null) {
            byte[] message = string.getBytes(StandardCharsets.UTF_8);
            String encoded = Base64.getEncoder().encodeToString(message);
            return encoded;
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
