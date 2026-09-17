from openpyxl import Workbook


def create_excel(testcases, file_path):

    wb = Workbook()
    ws = wb.active
    ws.title = "Test Cases"

    ws.append([
        "ID",
        "Title",
        "Pre Condition",
        "Steps",
        "Expected Result",
        "Priority",
        "Status"
    ])

    for tc in testcases:
        ws.append([
            tc.id,
            tc.title,
            tc.pre_condition,
            tc.steps,
            tc.expected_result,
            tc.priority,
            tc.status
        ])

    wb.save(file_path)