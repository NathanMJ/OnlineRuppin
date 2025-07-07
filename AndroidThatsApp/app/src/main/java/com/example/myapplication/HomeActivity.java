package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.*;

import java.util.List;

public class HomeActivity extends AppCompatActivity {

    private LinearLayout discussionList;
    private FirebaseFirestore db;
    private FirebaseUser currentUser;
    private LayoutInflater inflater;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        discussionList = findViewById(R.id.linearLayoutDiscussions);
        TextView textViewUserName = findViewById(R.id.textViewName);
        ImageView imageViewAdd = findViewById(R.id.imageViewAdd);
        inflater = LayoutInflater.from(this);

        db = FirebaseFirestore.getInstance();
        currentUser = FirebaseAuth.getInstance().getCurrentUser();

        if (currentUser != null) {
            textViewUserName.setText("Salut " + currentUser.getDisplayName());
            loadDiscussionsFromFirestore();
        } else {
            textViewUserName.setText("Salut invité");
        }

        imageViewAdd.setOnClickListener(v -> {
            Intent intent = new Intent(HomeActivity.this, AddDiscussionActivity.class);
            startActivity(intent);
        });
    }

    private void loadDiscussionsFromFirestore() {
        discussionList.removeAllViews();

        // On récupère toutes les discussions où l'utilisateur est membre
        db.collection("discussions")
                .whereArrayContains("members", currentUser.getUid())
                .get()
                .addOnSuccessListener(querySnapshot -> {
                    if (querySnapshot.isEmpty()) {
                        Toast.makeText(this, "Aucune discussion trouvée", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    for (DocumentSnapshot doc : querySnapshot.getDocuments()) {
                        String discussionId = doc.getId();
                        List<String> members = (List<String>) doc.get("members");

                        if (members == null) continue;

                        // Trouver l'autre utilisateur (différent du currentUser)
                        String otherUserId = null;
                        for (String memberId : members) {
                            if (!memberId.equals(currentUser.getUid())) {
                                otherUserId = memberId;
                                break;
                            }
                        }

                        if (otherUserId == null) continue;

                        // Récupérer le nom de l'autre utilisateur
                        db.collection("Users").document(otherUserId)
                                .get()
                                .addOnSuccessListener(userDoc -> {
                                    String otherUserName = "Utilisateur inconnu";
                                    if (userDoc.exists()) {
                                        otherUserName = userDoc.getString("name");
                                    }

// Créer la vue de la discussion
                                    View view = inflater.inflate(R.layout.item_discussion, discussionList, false);
                                    TextView name = view.findViewById(R.id.textViewName);
                                    TextView msg = view.findViewById(R.id.textViewMessage);

                                    name.setText(otherUserName);

// Récupérer le dernier message de la discussion
                                    db.collection("discussions")
                                            .document(discussionId)
                                            .collection("messages")
                                            .orderBy("timestamp", Query.Direction.DESCENDING)
                                            .limit(1)
                                            .get()
                                            .addOnSuccessListener(messageSnapshot -> {
                                                if (!messageSnapshot.isEmpty()) {
                                                    String lastMessageText = messageSnapshot.getDocuments().get(0).getString("text");
                                                    msg.setText(lastMessageText);
                                                } else {
                                                    msg.setText(""); // Pas de message encore
                                                }
                                            })
                                            .addOnFailureListener(e -> {
                                                msg.setText(""); // En cas d'erreur, on vide le champ
                                            });

                                    view.setOnClickListener(v -> {
                                        Intent intent = new Intent(HomeActivity.this, ChatActivity.class);
                                        intent.putExtra("discussionId", discussionId);
                                        startActivity(intent);
                                    });

                                    discussionList.addView(view);
                                });
                    }
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(this, "Erreur lors du chargement des discussions: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
    }
}
