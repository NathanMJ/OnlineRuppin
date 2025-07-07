package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class AddDiscussionActivity extends AppCompatActivity {

    private EditText inputPhone;
    private Button btnCheck;
    private FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_discussion);

        inputPhone = findViewById(R.id.input_phone_number);
        btnCheck = findViewById(R.id.btn_check_number);

        db = FirebaseFirestore.getInstance();

        btnCheck.setOnClickListener(v -> checkPhoneNumber());
    }

    private void checkPhoneNumber() {
        String phone = inputPhone.getText().toString().trim();

        if (phone.isEmpty()) {
            Toast.makeText(this, "Entrez un numéro de téléphone", Toast.LENGTH_SHORT).show();
            return;
        }

        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();
        if (currentUser == null) {
            Toast.makeText(this, "Utilisateur non connecté", Toast.LENGTH_SHORT).show();
            return;
        }

        // Récupérer le numéro de la personne connectée depuis Firestore
        db.collection("Users").document(currentUser.getUid())
                .get()
                .addOnSuccessListener(documentSnapshot -> {
                    if (documentSnapshot.exists()) {
                        String currentUserPhone = documentSnapshot.getString("phone");
                        if (phone.equals(currentUserPhone)) {
                            Toast.makeText(this, "Vous ne pouvez pas créer une discussion avec vous-même", Toast.LENGTH_SHORT).show();
                        } else {
                            // Chercher dans Users si le numéro existe
                            db.collection("Users")
                                    .whereEqualTo("phone", phone)
                                    .get()
                                    .addOnSuccessListener(querySnapshot -> {
                                        if (!querySnapshot.isEmpty()) {
                                            // Récupérer l'UID de l'autre utilisateur
                                            String otherUserId = querySnapshot.getDocuments().get(0).getId();

                                            // Créer la discussion
                                            createDiscussion(currentUser.getUid(), otherUserId);
                                        } else {
                                            Toast.makeText(this, "Numéro non trouvé.", Toast.LENGTH_SHORT).show();
                                        }
                                    })
                                    .addOnFailureListener(e -> {
                                        Toast.makeText(this, "Erreur: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                                    });
                        }
                    } else {
                        Toast.makeText(this, "Impossible de récupérer vos infos utilisateur.", Toast.LENGTH_SHORT).show();
                    }
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(this, "Erreur lors de la récupération: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                });
    }

    // Méthode pour créer la discussion dans Firestore
    private void createDiscussion(String currentUserId, String otherUserId) {
        Map<String, Object> discussionData = new HashMap<>();
        discussionData.put("members", Arrays.asList(currentUserId, otherUserId));
        discussionData.put("createdAt", FieldValue.serverTimestamp());

        db.collection("discussions")
                .add(discussionData)
                .addOnSuccessListener(documentReference -> {
                    Toast.makeText(this, "Discussion créée !", Toast.LENGTH_SHORT).show();

                    // Récupère l'ID de la discussion créée
                    String discussionId = documentReference.getId();
                    // Lance ChatActivity en passant l'ID de la discussion
                    Intent intent = new Intent(this, ChatActivity.class);
                    intent.putExtra("discussionId", discussionId);
                    startActivity(intent);

                    // Optionnel : fermer la page actuelle
                    finish();
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(this, "Erreur création discussion: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                });
    }



}
