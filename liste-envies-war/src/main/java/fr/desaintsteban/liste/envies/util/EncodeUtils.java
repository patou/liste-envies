package fr.desaintsteban.liste.envies.util;

import javax.xml.bind.DatatypeConverter;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

/**
 * Encode en base64 les textes pour empécher de les lires dans la base de donnée
 */
public class EncodeUtils {

    public static String encode(String string, boolean encode) {
        return encode ? encode(string): string;
    }

    public static String encode(String string) {
        if (string != null) {
            byte[] message = string.getBytes(StandardCharsets.UTF_8);
            String encoded = DatatypeConverter.printBase64Binary(message);
            return encoded;
        }
        return string;
    }

    public static String decode(String string, boolean decode) {
        return decode ? decode(string): string;
    }

    public static String decode(String string) {
        if (string != null) {
            byte[] decoded = DatatypeConverter.parseBase64Binary(string);
            return new String(decoded, StandardCharsets.UTF_8);
        }
        return string;
    }
}
