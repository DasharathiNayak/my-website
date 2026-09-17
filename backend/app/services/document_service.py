import fitz
from docx import Document

import fitz

def read_pdf(file_path):
    text = ""

    pdf = fitz.open(file_path)

    print("Total Pages:", len(pdf))

    for page in pdf:
        page_text = page.get_text()
        print(page_text)
        text += page_text

    pdf.close()

    return text


def read_docx(file_path):
    text = ""

    doc = Document(file_path)

    for para in doc.paragraphs:
        text += para.text + "\n"

    return text


def read_txt(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()