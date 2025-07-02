package com.example.myapplication;

import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.*;

import java.util.*;

public class ChatActivity extends AppCompatActivity {

    private TextView textViewOtherUserName;
    private EditText editTextMessage;
    private Button buttonSend;
    private RecyclerView recyclerViewMessages;

    private FirebaseFirestore db;
    private FirebaseAuth mAuth;

    private String discussionId;
    private String currentUserId;

    private MessageAdapter messagesAdapter;
    private List<Map<String, Object>> messageList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        textViewOtherUserName = findViewById(R.id.textViewOtherUserName);
        editTextMessage = findViewById(R.id.editTextMessage);
        buttonSend = findViewById(R.id.buttonSend);
        recyclerViewMessages = findViewById(R.id.recyclerViewMessages);

        db = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        discussionId = getIntent().getStringExtra("discussionId");
        currentUserId = mAuth.getCurrentUser().getUid();

        // Init messages
        messageList = new ArrayList<>();
        messagesAdapter = new MessageAdapter(messageList);
        recyclerViewMessages.setLayoutManager(new LinearLayoutManager(this));
        recyclerViewMessages.setAdapter(messagesAdapter);

        loadOtherUserName();
        listenForMessages();

        buttonSend.setOnClickListener(v -> sendMessage());
    }

    private void loadOtherUserName() {
        if (discussionId == null) return;

        db.collection("discussions").document(discussionId)
                .get()
                .addOnSuccessListener(documentSnapshot -> {
                    if (documentSnapshot.exists()) {
                        List<String> members = (List<String>) documentSnapshot.get("members");
                        if (members != null) {
                            for (String memberId : members) {
                                if (!memberId.equals(currentUserId)) {
                                    db.collection("Users").document(memberId)
                                            .get()
                                            .addOnSuccessListener(userSnapshot -> {
                                                if (userSnapshot.exists()) {
                                                    String name = userSnapshot.getString("name");
                                                    textViewOtherUserName.setText(name);
                                                }
                                            });
                                    break;
                                }
                            }
                        }
                    }
                });
    }

    private void listenForMessages() {
        db.collection("discussions")
                .document(discussionId)
                .collection("messages")
                .orderBy("timestamp", Query.Direction.ASCENDING)
                .addSnapshotListener((value, error) -> {
                    if (error != null) {
                        Toast.makeText(this, "Erreur récupération messages", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    if (value != null) {
                        messageList.clear();
                        for (DocumentSnapshot doc : value.getDocuments()) {
                            messageList.add(doc.getData());
                        }
                        messagesAdapter.notifyDataSetChanged();
                        recyclerViewMessages.scrollToPosition(messageList.size() - 1);
                    }
                });
    }

    private void sendMessage() {
        String messageText = editTextMessage.getText().toString().trim();
        if (messageText.isEmpty()) return;

        Map<String, Object> message = new HashMap<>();
        message.put("text", messageText);
        message.put("senderId", currentUserId);
        message.put("timestamp", FieldValue.serverTimestamp());

        db.collection("discussions")
                .document(discussionId)
                .collection("messages")
                .add(message)
                .addOnSuccessListener(documentReference -> editTextMessage.setText(""))
                .addOnFailureListener(e -> Toast.makeText(this, "Erreur envoi message", Toast.LENGTH_SHORT).show());
    }
}
