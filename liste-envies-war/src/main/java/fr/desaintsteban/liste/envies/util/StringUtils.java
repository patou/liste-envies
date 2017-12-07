package fr.desaintsteban.liste.envies.util;

public class StringUtils {
    private StringUtils() {
    }

    public static String withoutAccent(String txt) {
        if (txt == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        int n = txt.length();
        for (int i = 0; i < n; i++) {
            char c = txt.charAt(i);
            int pos = "àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ".indexOf(c);
            if (pos > -1) {
                sb.append("aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY".charAt(pos));
            } else if (c == 'œ' || c == 'Œ') {
                sb.append("oe");
            } else if (c == 'æ' || c == 'Æ') {
            	sb.append("ae");
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    public static String withoutAccentToUpperCase(String txt) {
        return withoutAccent(txt).toUpperCase();
    }

    public static String toValidIdName(String name) {
        return withoutAccent(name).replaceAll("[^-a-zA-Z0-9/]+", "-").toLowerCase();
    }

    public static String toValidIdFromName(String name) {
        return withoutAccent(name.trim()).toLowerCase().replaceAll("[^-a-z0-9/]+", "-");
    }

    public static String toSearchString(String string) {
    	if (isNullOrEmpty(string))
    		return "";
        return withoutAccentToUpperCase(string.trim()).replaceAll("[^A-Z0-9]+", " ").trim();
    }

    public static String upperFirstLetter(String content) {
        if (content.length() > 1) {
            return content.substring(0, 1).toUpperCase() + content.substring(1);
        } else {
            return content.toUpperCase();
        }
    }

    public static String n2br(String text) {
        if (isNullOrEmpty(text))
            return text;
        return text.replaceAll("(\r\n|\n\r|\r|\n)", "<br />");
    }

    public static boolean isNullOrEmpty(String text) {
        return text == null || text.isEmpty();
    }
}