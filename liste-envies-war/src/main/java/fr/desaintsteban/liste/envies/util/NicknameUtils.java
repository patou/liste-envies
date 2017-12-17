package fr.desaintsteban.liste.envies.util;

public class NicknameUtils {
    public static String getNickname(String email) {
        String nickname = email;
        if (nickname.indexOf('@') > 0) {
            nickname = nickname.substring(0, nickname.indexOf('@')).replace('.', ' ').replace('-', ' ');
        }
        return nickname;
    }
}
