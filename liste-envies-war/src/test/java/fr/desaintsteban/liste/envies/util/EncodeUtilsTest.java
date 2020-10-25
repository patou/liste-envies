package fr.desaintsteban.liste.envies.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;


/**
 *
 */
public class EncodeUtilsTest {
    @Test
    public void test_encode_decode() {
        String toto = "Toto";
        String encoded = EncodeUtils.encode(toto);
        String decoded = EncodeUtils.decode(encoded);
        assertEquals(toto, decoded);
    }
}
