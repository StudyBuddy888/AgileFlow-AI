import os
import json
from jira import JIRA
from datetime import datetime, timedelta

def get_issues_due_by_date(due_date):
   
    jira_server = os.getenv('JIRA_INSTANCE_URL', None)
    jira_username = os.getenv('JIRA_USERNAME', None)
    jira_password = os.getenv('JIRA_API_TOKEN', None)

  
    jira_options = {'server': jira_server}
    jira = JIRA(options=jira_options, basic_auth=(jira_username, jira_password))

  
    user = jira.current_user()

 
    jql = 'assignee={} AND due <= "{}"'.format(user, due_date)
    issues = jira.search_issues(jql)

    issues_list = []
    for issue in issues:
        issue_dict = {
            'key': issue.key,
            'summary': issue.fields.summary,
            'deadline': issue.fields.duedate
        }
        issues_list.append(issue_dict)

    return issues_list


due_date = (datetime.now() + timedelta(weeks=1)).strftime('%Y/%m/%d')
print(get_issues_due_by_date(due_date))