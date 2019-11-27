import gql from 'graphql-tag';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errorMessage: string;
}

export interface EmptyResponse {
  payload: ApiResponse<{}>;
}

export const GET_SESSION_INFO = gql`
  query SessionInfoQuery {
    sessionInfo {
      isLoggedIn @client
      accessToken
      accountModel {
        id
        mail
        userName
        userRole
      }
    }
  }
`;

export const LogoutMutation = gql`
  mutation LogoutMutation {
    logout @client
  }
`;

export interface LoginVariables {
  email: string;
  password: string;
}

export interface AccountModelPayload {
  id: number;
  mail: string;
  userName: string;
  userRole: number;
}

export interface LoginPayload {
  accessToken: string;
  accountModel: AccountModelPayload;
}

export interface LoginResponse {
  payload: ApiResponse<LoginPayload>;
}

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    payload(input: {email: $email, password: $password})
      @rest(type: "LoginMutationResponse", path: "cmc/login", method: "POST") {
      success
      errorMessage
      data @type(name: "sessionInfo") {
        accessToken
        accountModel @type(name: "AccountModel") {
          id
          mail
          userName
          userRole
        }
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation logoutMutation {
    payload(input: {})
      @rest(
        type: "logoutMutationMutationResponse"
        path: "cmc/logout"
        method: "POST"
      ) {
      success
      message
      errorMessage
    }
  }
`;

export interface ChangePasswordVariables {
  newPassword: string;
  newVerifyPassword: string;
  oldPassword: string;
}

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword(
    $newPassword: String!
    $newVerifyPassword: String!
    $oldPassword: String!
  ) {
    payload(
      input: {
        newPassword: $newPassword
        newVerifyPassword: $newVerifyPassword
        oldPassword: $oldPassword
      }
    )
      @rest(
        type: "ChangePasswordResponse"
        path: "cmc/changePassword"
        method: "POST"
      ) {
      success
      message
      errorMessage
    }
  }
`;

export const RECOVER_PASSWORD = gql`
  mutation recoverPassword($value: String!) {
    payload(input: {value: $value})
      @rest(
        type: "RecoverPasswordResponse"
        path: "cmc/recoverPassword"
        method: "POST"
      ) {
      data
      success
      message
      errorMessage
    }
  }
`;

export enum UserRoleEnum {
  Manager = 1,
  Management = 2,
  Client = 3,
}

export interface SignUpVariables {
  mail: string;
  password: string;
  userName: string;
  userRole: number;
}

export const SIGN_UP = gql`
  mutation SignUp(
    $mail: String!
    $password: String!
    $userName: String
    $userRole: Int!
  ) {
    payload(
      input: {
        mail: $mail
        password: $password
        userName: $userName
        userRole: $userRole
      }
    ) @rest(type: "SignUpResponse", path: "cmc/signUp", method: "POST") {
      success
      message
      errorMessage
    }
  }
`;

export const LIST_PROJECTS = gql`
  query ListProjects($count: Int, $offset: Int, $sortBy: String, $desc: Boolean, $onlyActive: Boolean) {
    payload(
        count: $count, 
        offset: $offset,
        sortBy: $sortBy,
        desc: $desc,
        onlyActive: $onlyActive
        )
      @rest(
        type: "ListProjects"
        path: "project/getProjects?{args}"
        method: "GET"
      ) {
      success
      dataSize
      data @type(name: "listProjectsResponse") {
        projectViews @type(name: "listOfProjects") {
          id
          projectName
          startDate
          endDate
          address
          pictureUrl
          overall
        }
        listSotrs
      }
      message
      errorMessage
    }
  }
`;

export interface ProjectIdParam {
  projectId: number;
}

export const LIST_SINGLE_PROJECT = gql`
  query SingleProject($projectId: Int) {
    payload(projectId: $projectId)
      @rest(
        type: "ListProjects"
        path: "project/getProject?{args}"
        method: "GET"
      ) {
      success
      data @type(name: "SingleProjectResponse") {
        projectView @type(name: "SingleProjectData") {
          id
          projectName
          startDate
          endDate
          address
          pictureUrl
        }
        scoreModel @type(name: "SingleProjectScores") {
          projectId
          budget
          schedule
          cmcValue
          clientSatisfaction
          issues
          overall
        }
        clientName
        budgetNote
        scheduleNote
        cmcValueNote
        clientSatisfactionNote
        issuesNote
        projectManager
        buildArea
        reportDate
        customizeModel @type(name: "SingleProjectCustomizeModel") {
          visible
          unVisible
        }
      }
      message
      errorMessage
    }
  }
`;

export const GET_BUDGET_DETAILS = gql`
  query SingleProject($projectId: Int) {
    payload(projectId: $projectId)
      @rest(
        type: "ListProjects"
        path: "project/budget/details?{args}"
        method: "GET"
      ) {
      success
      data @type(name: "BudgettResponse") {
        initialBudgets @type(name: "InitialBudgetsData") {
          key
          value
        }
        budgetVariations @type(name: "UpdatedBudgetScores") {
          key
          value
        }
        finalBudgets @type(name: "FinalBudgetScores") {
          key
          value
        }
      }
      message
      errorMessage
    }
  }
`;

export const GET_ISSUE_DETAILS = gql`
  query SingleProjectIssues(
    $projectId: Int
    $count: Int
    $offset: Int
    $onlyActive: Boolean
  ) {
    payload(
      projectId: $projectId
      count: $count
      offset: $offset
      onlyActive: $onlyActive
    )
      @rest(
        type: "ListProjects"
        path: "project/risk/details?{args}"
        method: "GET"
      ) {
      success
      dataSize
      data @type(name: "SingleIssuesResponse") {
        projectView @type(name: "issuesProjectView") {
          id
          projectName
          startDate
          endDate
          address
          pictureUrl
        }
        issues
      }
      message
      errorMessage
    }
  }
`;

export const GET_SATISFACTION_DETAILS = gql`
  query SingleProjectSatisfaction($projectId: Int, $count: Int, $offset: Int) {
    payload(projectId: $projectId, count: $count, offset: $offset)
      @rest(
        type: "ListProjects"
        path: "project/satisfaction/details?{args}"
        method: "GET"
      ) {
      success
      dataSize
      data @type(name: "SingleSatisfactionResponse") {
        projectView @type(name: "SatisfactionProjectView") {
          id
          projectName
          startDate
          endDate
          address
          pictureUrl
        }
        values
      }
      message
      errorMessage
    }
  }
`;

export const GET_CMCVALUE_DETAILS = gql`
  query SingleProjectCMCValue($projectId: Int, $count: Int, $offset: Int) {
    payload(projectId: $projectId, count: $count, offset: $offset)
      @rest(
        type: "ListProjects"
        path: "project/cmc-value/details?{args}"
        method: "GET"
      ) {
      success
      dataSize
      data @type(name: "SingleCMCValueResponse") {
        projectView @type(name: "CMCValueProjectView") {
          id
          projectName
          startDate
          endDate
          address
          pictureUrl
        }
        values
      }
      message
      errorMessage
    }
  }
`;

export const UPDATE_CUSTOMIZED_BLOCKS = gql`
  mutation signup($input: any) {
    payload(
      input: {
        companyName: $companyName
        email: $email
        password: $password
        type: $type
      }
    )
      @rest(
        type: "SignupCompanyMutationResponse"
        path: "/bloomhigh-ws/registration/signUp"
        method: "POST"
      ) {
      success
      message
      errorMessage
      data {
        email
        type
        url
        versionTime
      }
    }
  }
`;

// List of Project Issuebs
export const LIST_ALL_ISSUES = gql`
  query ListIsuues(
    $count: Int
    $offset: Int
    $sortBy: String
    $onlyActive: Boolean
  ) {
    payload(
      count: $count
      offset: $offset
      sortBy: $sortBy
      onlyActive: $onlyActive
    )
      @rest(
        type: "ListAllIssues"
        path: "project/getAllIssues?{args}"
        method: "GET"
      ) {
      success
      dataSize
      data @type(name: "listAllIssuesResponse") {
        projectViews @type(name: "listOfAllIssues") {
          id
          projectId
          name
          value
          createDate
          resolved
          ownerName
          projectName
          pictureUrl
        }
        listSotrs
      }
      message
      errorMessage
    }
  }
`;

// List of Project Issuebs
export const SEARCH_PROJECTS = gql`
    query SearchProjects(
        $value: String
        ){ 
        payload(
            value: $value
        )
            @rest(
            type: "SearchProjects",
            path: "project/searchProjects?{args}", 
            method: "GET"){
            success
            dataSize
            data @type (name: "SearchProjectResponse"){
                address
                endDate
                id
                overall
                pictureUrl
                projectName
                startDate
            }
            message
            errorMessage
        }
    }
`;
