package fr.desaintsteban.liste.envies.util;

import java.util.List;

public class ListUtils {
    public static boolean isNullOrEmpty(List<?> list) {
        return list == null || list.isEmpty();
    }
}
