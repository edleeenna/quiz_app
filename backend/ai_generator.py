from models import NotesFile, QuizQuestion
from dotenv import load_dotenv
from rag import  retrieve_context 
import os, re, requests

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_quiz_from_notes(notes_file: NotesFile) -> list[QuizQuestion]:
   
    # Retrieve context relevant to quiz generation

    query = "Key facts or quiz relevant information about " + notes_file.name

    print(query)

    context = retrieve_context(notes_file.id, query)

    # Step 3: Construct the prompt using RAG context
    prompt = f"""
        You are a helpful quiz master who writes high-quality, relevant, and realistic multiple-choice quiz questions to help people learn.

        Context:
        {context}

        Instructions:
        - Generate exactly {notes_file.num_questions} multiple-choice quiz questions based on the context above.
        - The example questions below may contain scenarios. If they do, then **all generated questions MUST follow the same format**: start with a short real-world scenario, then ask the question.
        - If the example is in scenario format (e.g., "Gurvinder has been asked to assist a company that..."), then every generated question must use a realistic scenario of 1–3 sentences followed by a question about it.
        - Use the **same tone, style, and structure** as the example questions.
        - Ensure the scenario directly relates to content in the context above.

        Example Questions:
        {notes_file.example_questions or 'None'}

        Formatting Rules:
        - Each question must have 4 answer options labeled a), b), c), and d).
        - Randomize the order of options.
        - The correct answer MUST be **exactly one of the 4 options**.
        - The correct answer MUST match one of the options **verbatim**.
        - All options should be plausible, but only one should be correct.
        - Do NOT include questions where the correct answer is not in the options.
        - Do NOT include explanations, thoughts, or reasoning.
        - Output only the formatted questions and answers.

        Output Format:
        Q: ...
        a) ...
        b) ...
        c) ...
        d) ...
        Answer: ...

        After writing {notes_file.num_questions} questions, write EndOfQuestions.
        """


    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "mistral-saba-24b",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
        "stop": ["EndOfQuestions"],
        "max_tokens": 2000,
        
    }

    response = requests.post(GROQ_API_URL, json=payload, headers=headers)
    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    print(content)
    
    return parse_questions(content, notes_file.num_questions)


def parse_questions(text: str, num_questions: int) -> list[QuizQuestion]:
    print("Parsing questions...")
    blocks = text.strip().split("Q:")
    questions = []

    for i, block in enumerate(blocks[1:], start=1):
        if len(questions) >= num_questions:
            break  # ⛔ Hard stop at required number

        try:
            lines = block.strip().split("\n")
            lines = [line.strip() for line in lines if line.strip()]
            if not lines:
                raise ValueError(f"Empty block {i}")

            question = lines[0]

            # --- Detect and parse options ---
            options = []

            # Format A: All options on one line
            options_line = next((line for line in lines if line.lower().startswith("options:")), None)
            if options_line:
                option_matches = re.findall(r"[a-dA-D]\)\s*([^,]+)", options_line)
                if len(option_matches) != 4:
                    raise ValueError(f"Block {i}: Expected 4 options in compact format, got {len(option_matches)}")
                options = [opt.strip() for opt in option_matches]
            else:
                # Format B: One line per option (A) ... (D)
                option_lines = [line for line in lines[1:5] if re.match(r"^[A-Da-d]\)", line)]
                if len(option_lines) != 4:
                    raise ValueError(f"Block {i}: Expected 4 options in multiline format, got {len(option_lines)}")
                options = [line.split(")", 1)[1].strip() for line in option_lines]

            # --- Extract correct answer ---
            answer_line = next((line for line in lines if line.lower().startswith("answer:")), None)
            if not answer_line:
                raise ValueError(f"Block {i}: Missing answer line")

            # Extract just the text (whether it’s “C” or “c) Paris” or “Answer: Paris”)
            correct_match = re.match(r"Answer:\s*(?:[a-dA-D]\)\s*)?(.*)", answer_line)
            if not correct_match:
                raise ValueError(f"Block {i}: Malformed answer line: {answer_line}")
            correct = correct_match.group(1).strip()

            questions.append(QuizQuestion(question=question, options=options, correct_answer=correct))
        except Exception as e:
            print(f"Error parsing block {i}: {e}")
            continue  # Skip bad blocks

    print(f"Parsed {len(questions)} questions.")
    return questions[:num_questions]


