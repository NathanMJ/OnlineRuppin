package com.example.myapplication;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;

import com.google.firebase.auth.*;
import com.google.firebase.firestore.*;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.io.File;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.Map;
import android.Manifest;
import android.content.pm.PackageManager;


public class RegisterActivity extends AppCompatActivity {

    private EditText nameInput, emailInput, passwordInput, phoneInput;
    private Button registerBtn;
    private FirebaseAuth mAuth;
    private FirebaseFirestore db;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        // Initialisation
        nameInput = findViewById(R.id.input_name);
        emailInput = findViewById(R.id.input_email);
        passwordInput = findViewById(R.id.input_password);
        phoneInput = findViewById(R.id.input_phone);
        registerBtn = findViewById(R.id.btn_register);

        mAuth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();


        registerBtn.setOnClickListener(v -> registerUser());
    }



    private boolean validateInputs() {
        String name = nameInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        String phone = phoneInput.getText().toString().trim();

        if (name.isEmpty()) {
            nameInput.setError("Name required");
            return false;
        }

        if (email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailInput.setError("Valid email required");
            return false;
        }

        if (password.isEmpty() || password.length() < 6) {
            passwordInput.setError("Password must be at least 6 characters");
            return false;
        }

        if (phone.isEmpty() || !phone.matches("\\d{10,}")) { // adapte regex selon pays
            phoneInput.setError("Valid phone number required");
            return false;
        }

        return true;
    }


    private void saveUserInFirestore(String uid, Map<String, Object> userData) {
        db.collection("Users").document(uid)
                .set(userData)
                .addOnSuccessListener(unused -> {
                    Toast.makeText(this, "Inscription réussie", Toast.LENGTH_SHORT).show();
                    startActivity(new Intent(this, HomeActivity.class));
                    finish();
                })
                .addOnFailureListener(e ->
                        Toast.makeText(this, "Erreur Firestore: " + e.getMessage(), Toast.LENGTH_SHORT).show());
    }

    private void registerUser() {
        if (!validateInputs()) return;

        String name = nameInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        String phone = phoneInput.getText().toString().trim();

        // Vérifie que le numéro n'existe pas déjà
        db.collection("Users")
                .whereEqualTo("phone", phone)
                .get()
                .addOnSuccessListener(query -> {
                    if (!query.isEmpty()) {
                        Toast.makeText(this, "Phone number already in use", Toast.LENGTH_SHORT).show();
                    } else {
                        // Créer l'utilisateur Firebase
                        mAuth.createUserWithEmailAndPassword(email, password)
                                .addOnCompleteListener(task -> {
                                    if (task.isSuccessful()) {
                                        FirebaseUser user = mAuth.getCurrentUser();

                                        if (user != null) {
                                            // Met à jour le displayName
                                            UserProfileChangeRequest profileUpdates = new UserProfileChangeRequest.Builder()
                                                    .setDisplayName(name)
                                                    .build();

                                            user.updateProfile(profileUpdates).addOnCompleteListener(profileTask -> {

                                                // Prépare les données
                                                Map<String, Object> userData = new HashMap<>();
                                                userData.put("name", name);
                                                userData.put("email", email);
                                                userData.put("phone", phone);
                                                saveUserInFirestore(user.getUid(), userData);
                                            });
                                        }
                                    } else {
                                        Toast.makeText(this, "Register failed: " + task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                });
                    }
                })
                .addOnFailureListener(e ->
                        Toast.makeText(this, "Error checking phone: " + e.getMessage(), Toast.LENGTH_SHORT).show());
    }

}
