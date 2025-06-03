from models import NotesFile, QuizQuestion
from dotenv import load_dotenv
from rag import  retrieve_context 
import os, re, requests

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_quiz_from_notes(notes_file: NotesFile) -> list[QuizQuestion]:
   
    # Retrieve context relevant to quiz generation

    query = "Important information and facts suitable for quiz questions"

    context = retrieve_context(notes_file.id, query)

    # Step 3: Construct the prompt using RAG context
    prompt = f"""
    You are a helpful quiz master who likes to curate interesting & relevant quiz questions that help people learn

    Based on the following extracted context from notes:
    {context}

    Generate {notes_file.num_questions} multiple-choice quiz questions.

    Example Questions:
    {notes_file.example_questions or 'None'}

    Instructions:
    - Return exactly {notes_file.num_questions} questions.
    - Each question must have 4 answer options labeled a), b), c), and d).
    - Randomize the order of the options.
    - The correct answer MUST be **exactly one of the 4 options**.
    - The correct answer MUST match one of the options **verbatim**.
    - All options should be plausible, but only one should be correct.
    - Do NOT include questions where the correct answer is not present in the options.
    - Ensure clarity, accuracy, and relevance to the notes.
    - Use the example questions to guide style and format. 
    - Do NOT include any explanation, thinking, or reasoning before the questions.
    - Only output the final formatted questions and answers in the specified structure.
    - The answer line must include both the correct option letter and the full answer text (e.g., "Answer: b) Loss of data").



    Output Format:
    Q: ...
    a) ...
    b) ...
    c) ...
    d) ...
    Answer: ...
    """

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek-r1-distill-llama-70b",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        
    }

    response = requests.post(GROQ_API_URL, json=payload, headers=headers)
    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]

    return parse_questions(content)


def parse_questions(text: str) -> list[QuizQuestion]:
    print("Parsing questions...")
    blocks = text.strip().split("Q:")
    questions = []

    for i, block in enumerate(blocks[1:], start=1):
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
    return questions


