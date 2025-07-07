package com.example.myapplication;

import com.google.firebase.Timestamp;

public class Message {
    private String text;
    private String senderId;
    private Timestamp timestamp;

    // Constructeur vide requis pour Firestore
    public Message() {}

    // Constructeur avec champs
    public Message(String text, String senderId, Timestamp timestamp) {
        this.text = text;
        this.senderId = senderId;
        this.timestamp = timestamp;
    }

    // Getters et setters
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }

    public String getSenderId() {
        return senderId;
    }
    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
