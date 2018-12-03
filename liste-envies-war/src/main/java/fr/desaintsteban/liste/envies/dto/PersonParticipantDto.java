package fr.desaintsteban.liste.envies.dto;

public class PersonParticipantDto extends PersonDto {
    String amount;
    String message;

    public PersonParticipantDto() {
    }

    public PersonParticipantDto(String email, String name, String picture, String amount, String message) {
        super(email, name, picture);
        this.amount = amount;
        this.message = message;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
