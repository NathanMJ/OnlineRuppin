import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
from pymongo import MongoClient
import re

# Connexion à MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["RuppinPlates"]
collection = db["plates"]

def get_plates_from_db():
    # Récupère toutes les plaques (_id) depuis la base, en liste Python
    docs = collection.find({}, {"_id": 1})
    return [doc["_id"] for doc in docs]


def is_valid_plate(plate):
    pattern = r"^\d{3}-\d{4}-\d{3}$|^\d{4}-\d{3}-\d{4}$"
    return bool(re.match(pattern, plate))

def open_plate_window(plate_text):
    detail_win = tk.Toplevel()
    detail_win.title("Details of the plate")
    detail_win.geometry("350x450")
    detail_win.config(bg="#f5f5f5")

    title = tk.Label(detail_win, text="Details of the plate", font=("Arial", 18, "bold"), bg="#f5f5f5")
    title.pack(pady=10)

    label = tk.Label(detail_win, text=plate_text, font=("Arial", 22), fg="#333", bg="#f5f5f5")
    label.pack(pady=10)

    def open_edit():
        entry = tk.Entry(detail_win, font=("Arial", 16))
        entry.insert(0, plate_text)
        entry.pack(pady=5)

        def save_edit():
            new_value = entry.get().strip()

            if not is_valid_plate(new_value):
                messagebox.showinfo(
                    "Error",
                    "Invalid plate format.\nAccepted formats: XXX-XXXX-XXX or XXXX-XXX-XXXX"
                )
                return  # On quitte la fonction sans fermer la fenêtre

            if new_value and new_value != plate_text:
                if collection.find_one({"_id": new_value}):
                    messagebox.showinfo("Error", "This plate already exists.")
                    return
                else:
                    collection.delete_one({"_id": plate_text})
                    collection.insert_one({"_id": new_value})
                    refresh_plates()
                    detail_win.destroy()

        save_btn = tk.Button(detail_win, text="Save", command=save_edit, font=("Arial", 12), bg="blue", fg="white")
        save_btn.pack()

    edit_btn = tk.Button(detail_win, text="Modify", command=open_edit, font=("Arial", 12), bg="orange", fg="white")
    edit_btn.pack(pady=5)

    close_btn = tk.Button(detail_win, text="Close", command=detail_win.destroy, font=("Arial", 12))
    close_btn.pack(pady=10)

def refresh_plates():
    # Recharge la liste depuis la base
    global plates
    plates = get_plates_from_db()

    for widget in scrollable_frame.winfo_children():
        widget.destroy()

    for plate in plates:
        plate_frame = tk.Frame(scrollable_frame, bg="lightgray", height=60)
        plate_frame.pack(fill="x", padx=10, pady=5)

        container = tk.Frame(plate_frame, bg="lightgray")
        container.pack(expand=True, fill="x")

        plate_label = tk.Label(container, text=plate, font=("Arial", 20), bg="lightgray", cursor="hand2")
        plate_label.pack(side="left", padx=(0, 10))
        plate_label.bind("<Button-1>", lambda e, p=plate: open_plate_window(p))

        delete_btn = tk.Button(container, text="X", font=("Arial", 14), bg="red", fg="white",
                               command=lambda p=plate: confirm_delete(p))
        delete_btn.pack(side="right")

def confirm_delete(plate_to_delete):
    answer = messagebox.askyesno("Confirm", f"Delete the plate : {plate_to_delete} ?")
    if answer:
        collection.delete_one({"_id": plate_to_delete})
        refresh_plates()

def open_add_window():
    add_window = tk.Toplevel()
    add_window.title("Add a plate")
    add_window.geometry("300x150")
    entry = tk.Entry(add_window, font=("Arial", 16))
    entry.pack(pady=10)

    def add_plate():
        new_plate = entry.get().strip()
        if not new_plate:
            return

        if not is_valid_plate(new_plate):
            messagebox.showinfo("Error", "Invalid plate format.\nAccepted formats: XXX-XXXX-XXX or XXXX-XXX-XXXX")
            return

        if collection.find_one({"_id": new_plate}):
            messagebox.showinfo("Already existing", f"The plate \"{new_plate}\" already exists.")
        else:
            collection.insert_one({"_id": new_plate})
            refresh_plates()
            add_window.destroy()

    btn = tk.Button(add_window, text="Add", command=add_plate, font=("Arial", 14))
    btn.pack()

# Setup fenêtre principale
window = tk.Tk()
window.title("My plates")
window.geometry("400x500")

title = tk.Label(window, text="My plates", font=("Arial", 24), pady=10)
title.pack()

container = ttk.Frame(window)
canvas = tk.Canvas(container)
scrollbar = ttk.Scrollbar(container, orient="vertical", command=canvas.yview)
scrollable_frame = ttk.Frame(canvas)

scrollable_frame.bind("<Configure>", lambda e: canvas.configure(
    scrollregion=canvas.bbox("all"),
    width=380
))

canvas.create_window((200, 0), window=scrollable_frame, anchor="n")
canvas.configure(yscrollcommand=scrollbar.set)

container.pack(fill="both", expand=True)
canvas.pack(side="left", fill="both", expand=True)
scrollbar.pack(side="right", fill="y")

# Initialisation des plaques depuis la base
plates = get_plates_from_db()
refresh_plates()

add_btn = tk.Button(window, text="+", font=("Arial", 24), command=open_add_window, bg="green", fg="white")
add_btn.place(relx=1.0, rely=1.0, anchor="se", x=-20, y=-20)

window.mainloop()
