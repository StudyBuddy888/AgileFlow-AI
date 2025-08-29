from jira import JIRA
import os

def get_jira_user():
    jira_server = os.getenv('JIRA_INSTANCE_URL', None) # e.g. https://jira.example.com
    jira_username = os.getenv('JIRA_USERNAME', None) # e.g. jira_username
    jira_password = os.getenv('JIRA_API_TOKEN', None) # e.g. jira_user_password.

    
    jira_options = {'server': jira_server}
    jira = JIRA(options=jira_options, basic_auth=(jira_username, jira_password))

 
    user = jira.current_user()


    user_dict = {'username': user}

    return user_dict


print(get_jira_user())