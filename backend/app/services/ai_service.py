import os
import json

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# ============================================================
# GENERATE TEST CASES
# ============================================================

def generate_test_cases(requirement_text, existing_testcases=None):

    existing_context = ""

    if existing_testcases:
        existing_context = "\n\nEXISTING TEST CASES:\n"

        for index, tc in enumerate(existing_testcases, start=1):
            existing_context += f"""
Existing Test Case {index}:

Title: {tc.get("title", "")}

Pre-condition: {tc.get("pre_condition", "")}

Steps: {tc.get("steps", "")}

Expected Result: {tc.get("expected_result", "")}

Priority: {tc.get("priority", "")}

"""

    prompt = f"""
You are a Senior Software Test Engineer.

Analyze the complete software requirement carefully.

Generate high-quality manual software test cases covering all
meaningful scenarios from the NEW requirement.

Include where applicable:

- Positive scenarios
- Negative scenarios
- Boundary value scenarios
- Validation scenarios
- Functional scenarios
- Business rule scenarios
- Error handling scenarios
- Authentication and authorization scenarios
- Data validation scenarios
- Integration scenarios
- UI scenarios
- Edge cases

IMPORTANT DUPLICATE PREVENTION:

The existing test cases listed below are ALREADY PRESENT in the
database.

Before generating each test case, compare its actual scenario,
functionality, validation, business rule, condition and expected
behavior with the existing test cases.

If an existing test case already covers the same scenario, DO NOT
generate it again.

The wording does NOT need to be identical to consider it a duplicate.

Example:

Existing test case:
"Verify login with invalid password"

Do NOT generate:
"Verify login failure when incorrect password is entered"

These represent the same scenario.

Only generate genuinely NEW test scenarios introduced or required
by the NEW requirement.

Do NOT rewrite, modify or reproduce existing test cases.

If all scenarios from the new requirement are already covered by
existing test cases, return an EMPTY test_cases array.

Return ONLY valid JSON.

Required format:

{{
    "test_cases": [
        {{
            "title": "Test case title",
            "pre_condition": "Pre-condition",
            "steps": "Step 1. Step 2. Step 3.",
            "expected_result": "Expected result",
            "priority": "High"
        }}
    ]
}}

EXISTING TEST CASES:
{existing_context}

NEW REQUIREMENT:
{requirement_text}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    result = response.choices[0].message.content.strip()

    if result.startswith("```json"):
        result = result.replace("```json", "", 1)

    if result.endswith("```"):
        result = result[:-3]

    result = result.strip()

    return json.loads(result)["test_cases"]


# ============================================================
# REQUIREMENT SUMMARY
# ============================================================

def generate_requirement_summary(text):

    prompt = f"""
You are a Senior Business Analyst.

Read the following software requirement and provide a concise summary.

Return ONLY valid JSON.

{{
    "summary": [
        "Point 1",
        "Point 2",
        "Point 3",
        "Point 4",
        "Point 5"
    ]
}}

Requirement:

{text}
"""

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    result = completion.choices[0].message.content.strip()

    if result.startswith("```json"):
        result = result.replace("```json", "", 1)

    if result.endswith("```"):
        result = result[:-3]

    result = result.strip()

    return json.loads(result)


# ============================================================
# BUG REPORT
# ============================================================

def generate_bug_report(testcase):

    prompt = f"""
You are a Senior Software QA Engineer.

Generate a professional bug report based on the following test case.

Test Case Title:
{testcase.title}

Pre-condition:
{testcase.pre_condition}

Test Steps:
{testcase.steps}

Expected Result:
{testcase.expected_result}

Priority:
{testcase.priority}

Return ONLY valid JSON in the following format:

{{
    "title": "Clear bug title",
    "description": "Detailed description of the issue",
    "steps_to_reproduce": "Step 1. Step 2. Step 3.",
    "expected_result": "Expected behavior",
    "actual_result": "Actual behavior",
    "severity": "Medium",
    "priority": "Medium"
}}

Do not invent unnecessary application-specific details.
Use the information available in the test case.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    result = response.choices[0].message.content.strip()

    if result.startswith("```json"):
        result = result.replace("```json", "", 1)

    if result.endswith("```"):
        result = result[:-3]

    result = result.strip()

    return json.loads(result)


# ============================================================
# AUTOMATION SCRIPT
# ============================================================

def generate_automation_script(testcase):

    prompt = f"""
You are a Senior QA Automation Engineer.

Generate a Selenium Python automation script for the following test case.

Test Case Title:

{testcase.title}

Pre-condition:

{testcase.pre_condition}

Test Steps:

{testcase.steps}

Expected Result:

{testcase.expected_result}

Priority:

{testcase.priority}

Important:

- Generate valid Selenium Python code.
- Follow the provided Pre-condition and Test Steps exactly.
- The automation must validate the provided Expected Result.
- Do not add unrelated test actions or scenarios.
- All XPath expressions must be syntactically valid.
- Never use invalid nested XPath conditions.
- Use XPath union (|) when selecting alternative elements.
- Do not invent invalid XPath syntax.
- If application URL, locator, credentials, or test data are not provided,
  clearly mark them as configurable placeholders.
- Do not assume that placeholder values are real application values.

Return only Python code.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    result = response.choices[0].message.content.strip()

    if result.startswith("```python"):
        result = result.replace("```python", "", 1)

    if result.startswith("```"):
        result = result.replace("```", "", 1)

    if result.endswith("```"):
        result = result[:-3]

    return result.strip()


# ============================================================
# TEST DATA
# ============================================================

def generate_test_data(testcase):

    prompt = f"""
You are a Senior QA Engineer.

Generate realistic test data for the following test case.

Test Case Title:

{testcase.title}

Expected Result:

{testcase.expected_result}

Return the test data in this format:

Name:

Email:

Mobile:

Address:

PAN:

Aadhaar:

DOB:

Password:
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content.strip()


# ============================================================
# QA AI
# ============================================================

def ask_qa_ai(question, context=""):

    prompt = f"""
You are a Senior Software QA Engineer.

Answer the user's question in a clear and professional manner.

Question:

{question}

Project/TestCraftAI Context:

{context}

Important:

- Use the provided project context when the question is about the
  user's projects, test cases, automation, bugs, status, priority,
  or project statistics.

- Do not invent project data.

- If the requested information is not present in the context,
  clearly say that it is not available.

- For general QA questions that are unrelated to project data,
  answer using your QA knowledge.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4
    )

    return response.choices[0].message.content.strip()