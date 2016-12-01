package fr.desaintsteban.liste.envies.util;

import org.junit.Test;

import static junit.framework.TestCase.assertEquals;

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