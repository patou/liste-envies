package fr.desaintsteban.liste.envies.util;

import javax.xml.bind.DatatypeConverter;
import java.io.UnsupportedEncodingException;

/**
 * Encode en base64 les textes pour empécher de les lires dans la base de donnée
 */
public class EncodeUtils {

    public static String encode(String string, boolean encode) {
        return encode ? encode(string): string;
    }

    public static String encode(String string) {
        if (string != null) {
            try {
                byte[] message = string.getBytes("UTF-8");
                String encoded = DatatypeConverter.printBase64Binary(message);
                return encoded;
            } catch (UnsupportedEncodingException e) {
            }
        }
        return string;
    }

    public static String decode(String string, boolean decode) {
        return decode ? decode(string): string;
    }

    public static String decode(String string) {
        if (string != null) {
            try {
                byte[] decoded = DatatypeConverter.parseBase64Binary(string);
                return new String(decoded, "UTF-8");
            } catch (UnsupportedEncodingException e) {
            }
        }
        return string;
    }
}