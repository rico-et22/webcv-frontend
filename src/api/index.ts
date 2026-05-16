/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterDto {
  /** @example "user@example.com" */
  email: string;
  /**
   * @minLength 8
   * @example "StrongPass1"
   */
  password: string;
}

export interface AuthUserDto {
  /** @example "eeb0e10b-f4ba-45ba-8cf8-19ba470be92e" */
  id: string;
  /** @example "authenticated" */
  aud: string;
  /** @example "authenticated" */
  role: string;
  /** @example "ricoet22+test1@gmail.com" */
  email: string;
  /** @example "2026-04-19T13:38:38.93126Z" */
  created_at: string;
  /** @example "2026-05-10T19:24:01.952497Z" */
  updated_at: string;
}

export interface RegisterResponseDto {
  data: AuthUserDto;
  /** @example "Registration successful. Please verify your email." */
  message: string;
}

export interface LoginDto {
  /** @example "user@example.com" */
  email: string;
  /** @example "StrongPass1" */
  password: string;
}

export interface AuthSessionDataDto {
  /** @example "eyJhbGciOiJFUzI1NiIs..." */
  access_token: string;
  /** @example "psnzwhdbv64i" */
  refresh_token: string;
  user: AuthUserDto;
}

export interface AuthResponseDto {
  data: AuthSessionDataDto;
  /** @example "Login successful" */
  message: string;
}

export interface RefreshTokenDto {
  /**
   * The refresh token issued during login
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  refreshToken: string;
}

export interface ResetPasswordDto {
  /** @example "user@example.com" */
  email: string;
}

export interface ConfirmResetDto {
  /**
   * Access token from the Supabase password reset link (hash fragment)
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
  /**
   * @minLength 8
   * @example "NewPass1"
   */
  newPassword: string;
}

export interface ChangePasswordDto {
  /** @example "OldPass1" */
  currentPassword: string;
  /**
   * @minLength 8
   * @example "NewPass1"
   */
  newPassword: string;
}

export interface UserResponseDto {
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  id: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "authenticated" */
  role: string;
  /** @example "2026-01-01T12:00:00Z" */
  created_at: string;
}

export interface UpdateUserDto {
  /** @example "new@example.com" */
  email?: string;
}

export interface ContactDto {
  /** @example "kamil@example.com" */
  email?: string;
  /** @example "+48 123 456 789" */
  phone?: string;
  /** @example "https://linkedin.com/in/kamilpawlak" */
  linkedin?: string;
  /** @example "https://github.com/kamilpawlak" */
  github?: string;
  /** @example "https://kamilpawlak.com" */
  website?: string;
}

export interface ExperienceDto {
  /** @example "Example Corp" */
  company: string;
  /** @example "Frontend Developer" */
  role: string;
  /** @example "2022-01" */
  startDate: string;
  /** @example "2024-06" */
  endDate?: string;
  /** @example "Built and maintained React applications." */
  description?: string;
}

export interface EducationDto {
  /** @example "WSIiZ Rzeszów" */
  institution: string;
  /** @example "Bachelor of Computer Science" */
  degree: string;
  /** @example "2023-10" */
  startDate: string;
  /** @example "2027-06" */
  endDate?: string;
}

export interface ProjectDto {
  /** @example "webCV" */
  name: string;
  /** @example "A portfolio site generator for IT professionals." */
  description?: string;
  /** @example "https://github.com/kamilpawlak/webcv" */
  url?: string;
  /**
   * Supabase Storage path in the screenshots bucket. The generator derives the public URL from this at render time.
   * @example "50b61a6d-37d2-473c-a00b-b2da9d1caf9b/22de84be-e6ab-4fbb-9a58-a132f51fb97c/1774082008960.png"
   */
  imageStoragePath?: string;
}

export interface AchievementDto {
  /** @example "1st place — University Hackathon 2024" */
  title: string;
  /** @example "Built a real-time collaboration tool in 24h." */
  description?: string;
}

export interface SiteResponseDto {
  /** @example "Kamil Pawlak" */
  fullName: string;
  /** @example "Full-Stack Developer" */
  jobTitle?: string;
  /** @example "Rzeszów, Poland" */
  location?: string;
  /** @example "Passionate developer with 3+ years of experience..." */
  bio?: string;
  /** @example "https://example.com/storage/avatar.png" */
  avatarUrl?: string;
  /** @example "user-id/site-id/avatar.png" */
  avatarStoragePath?: string;
  contacts?: ContactDto;
  /** @example ["TypeScript","NestJS","React"] */
  skills?: string[];
  experience?: ExperienceDto[];
  education?: EducationDto[];
  projects?: ProjectDto[];
  achievements?: AchievementDto[];
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  id: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  userId: string;
  /** @example "2026-01-01T12:00:00Z" */
  createdAt: string;
  /** @example "2026-01-01T12:00:00Z" */
  updatedAt: string;
}

export interface SiteSummaryResponseDto {
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  id: string;
  /** @example "Kamil Pawlak" */
  fullName: string;
  /** @example "Full-Stack Developer" */
  jobTitle?: string;
  /** @example "https://example.com/avatar.png" */
  avatarUrl?: string;
  /** @example "2026-01-01T12:00:00Z" */
  createdAt: string;
  /** @example "2026-01-01T12:00:00Z" */
  updatedAt: string;
}

export interface CreateSiteDto {
  /** @example "Kamil Pawlak" */
  fullName: string;
  /** @example "Full-Stack Developer" */
  jobTitle?: string;
  /** @example "Rzeszów, Poland" */
  location?: string;
  /** @example "Passionate developer with 3+ years of experience..." */
  bio?: string;
  /** @example "https://example.com/storage/avatar.png" */
  avatarUrl?: string;
  /** @example "user-id/site-id/avatar.png" */
  avatarStoragePath?: string;
  contacts?: ContactDto;
  /** @example ["TypeScript","NestJS","React"] */
  skills?: string[];
  experience?: ExperienceDto[];
  education?: EducationDto[];
  projects?: ProjectDto[];
  achievements?: AchievementDto[];
}

export interface UpdateSiteDto {
  /** @example "Kamil Pawlak" */
  fullName?: string;
  /** @example "Full-Stack Developer" */
  jobTitle?: string;
  /** @example "Rzeszów, Poland" */
  location?: string;
  /** @example "Passionate developer with 3+ years of experience..." */
  bio?: string;
  /** @example "https://example.com/storage/avatar.png" */
  avatarUrl?: string;
  /** @example "user-id/site-id/avatar.png" */
  avatarStoragePath?: string;
  contacts?: ContactDto;
  /** @example ["TypeScript","NestJS","React"] */
  skills?: string[];
  experience?: ExperienceDto[];
  education?: EducationDto[];
  projects?: ProjectDto[];
  achievements?: AchievementDto[];
}

export interface UploadResponseDataDto {
  /** @example "https://xyz.supabase.co/storage/v1/object/public/avatars/user-id/avatar.png" */
  url: string;
  /** @example "user-id/avatar.png" */
  storagePath: string;
}

export interface UploadResponseDto {
  data: UploadResponseDataDto;
  /** @example "File uploaded successfully" */
  message: string;
}

export interface DeleteFileDto {
  /**
   * Full storage path returned by an upload endpoint
   * @example "user-uuid/avatar.png"
   */
  path: string;
  /**
   * Bucket name the file lives in
   * @example "avatars"
   */
  bucket: "avatars" | "screenshots";
}

export interface AnalyzeCvResponseDto {
  /** @example "Kamil Pawlak" */
  fullName: string;
  /** @example "Full-Stack Developer" */
  jobTitle?: string;
  /** @example "Rzeszów, Poland" */
  location?: string;
  /** @example "Passionate developer with 3+ years of experience..." */
  bio?: string;
  contacts?: ContactDto;
  /** @example ["TypeScript","NestJS","React"] */
  skills?: string[];
  experience?: ExperienceDto[];
  education?: EducationDto[];
}

export interface AnalyzeCvEnvelopeDto {
  data: AnalyzeCvResponseDto;
  /** @example "CV analyzed successfully" */
  message: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title webCV API
 * @version 1.0
 * @contact
 *
 * REST API for the webCV portfolio generator
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRegister
     * @summary Create a new user account
     * @request POST:/auth/register
     */
    authControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<RegisterResponseDto, void>({
        path: `/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerLogin
     * @summary Authenticate and receive a JWT
     * @request POST:/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<AuthResponseDto, void>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRefreshToken
     * @summary Refresh an expired access token
     * @request POST:/auth/refresh
     */
    authControllerRefreshToken: (
      data: RefreshTokenDto,
      params: RequestParams = {},
    ) =>
      this.request<AuthResponseDto, void>({
        path: `/auth/refresh`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerResetPassword
     * @summary Initiate password reset (Supabase email link flow)
     * @request POST:/auth/reset-password
     */
    authControllerResetPassword: (
      data: ResetPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerConfirmReset
     * @summary Complete password reset using the token from the reset email link
     * @request PUT:/auth/confirm-reset
     */
    authControllerConfirmReset: (
      data: ConfirmResetDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/auth/confirm-reset`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerChangePassword
     * @summary Update password (verifies current password first)
     * @request PUT:/auth/change-password
     * @secure
     */
    authControllerChangePassword: (
      data: ChangePasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/auth/change-password`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersControllerGetMe
     * @summary Get current user profile
     * @request GET:/users/me
     * @secure
     */
    usersControllerGetMe: (params: RequestParams = {}) =>
      this.request<
        {
          data?: UserResponseDto;
          /** @example "User profile retrieved successfully" */
          message?: string;
        },
        void
      >({
        path: `/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerUpdate
     * @summary Update current user account details
     * @request PUT:/users/me
     * @secure
     */
    usersControllerUpdate: (data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/me`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerDeleteAccount
     * @summary Delete current user account
     * @request DELETE:/users/delete-account
     * @secure
     */
    usersControllerDeleteAccount: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/delete-account`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  sites = {
    /**
     * No description
     *
     * @tags sites
     * @name SitesControllerCreate
     * @summary Create a new portfolio site
     * @request POST:/sites
     * @secure
     */
    sitesControllerCreate: (data: CreateSiteDto, params: RequestParams = {}) =>
      this.request<
        {
          data?: SiteResponseDto;
          /** @example "Portfolio created successfully" */
          message?: string;
        },
        void
      >({
        path: `/sites`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sites
     * @name SitesControllerFindAll
     * @summary Get all portfolio sites for the current user
     * @request GET:/sites
     * @secure
     */
    sitesControllerFindAll: (params: RequestParams = {}) =>
      this.request<
        {
          data?: SiteSummaryResponseDto[];
          /** @example "Portfolios retrieved successfully" */
          message?: string;
        },
        void
      >({
        path: `/sites`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sites
     * @name SitesControllerFindOne
     * @summary Get a specific portfolio site by ID
     * @request GET:/sites/{id}
     * @secure
     */
    sitesControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          data?: SiteResponseDto;
          /** @example "Portfolio retrieved successfully" */
          message?: string;
        },
        void
      >({
        path: `/sites/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sites
     * @name SitesControllerUpdate
     * @summary Update a portfolio site
     * @request PUT:/sites/{id}
     * @secure
     */
    sitesControllerUpdate: (
      id: string,
      data: UpdateSiteDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: SiteResponseDto;
          /** @example "Portfolio updated successfully" */
          message?: string;
        },
        void
      >({
        path: `/sites/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sites
     * @name SitesControllerRemove
     * @summary Delete a portfolio site
     * @request DELETE:/sites/{id}
     * @secure
     */
    sitesControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/sites/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  storage = {
    /**
     * @description Uploads an image file to the specified bucket. The file is stored under `userId/<timestamp>.<ext>`. Use this before creating a site to obtain the `storagePath` (and optionally `url`) to embed in the site payload.
     *
     * @tags storage
     * @name StorageControllerUpload
     * @summary Upload an image to a storage bucket
     * @request POST:/storage/upload
     * @secure
     */
    storageControllerUpload: (
      data: {
        /**
         * Image file (jpeg, png, webp, gif, max 50 MB)
         * @format binary
         */
        file: File;
        /** Target storage bucket */
        bucket: "avatars" | "screenshots";
      },
      params: RequestParams = {},
    ) =>
      this.request<UploadResponseDto, void>({
        path: `/storage/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags storage
     * @name StorageControllerDeleteFile
     * @summary Delete a file from storage by its path and bucket
     * @request DELETE:/storage/file
     * @secure
     */
    storageControllerDeleteFile: (
      data: DeleteFileDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/storage/file`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  ai = {
    /**
     * No description
     *
     * @tags ai
     * @name AiControllerAnalyzeCv
     * @summary Parse a PDF CV and return prefilled portfolio data using Gemini AI
     * @request POST:/ai/analyze-cv
     * @secure
     */
    aiControllerAnalyzeCv: (
      data: {
        /**
         * PDF CV file (max 5 MB)
         * @format binary
         */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<AnalyzeCvEnvelopeDto, void>({
        path: `/ai/analyze-cv`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  generator = {
    /**
     * No description
     *
     * @tags generator
     * @name GeneratorControllerPreview
     * @summary Preview portfolio as a self-contained HTML page
     * @request GET:/generator/preview/{siteId}
     * @secure
     */
    generatorControllerPreview: (siteId: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/generator/preview/${siteId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags generator
     * @name GeneratorControllerZip
     * @summary Download portfolio as a static ZIP file
     * @request GET:/generator/zip/{siteId}
     * @secure
     */
    generatorControllerZip: (siteId: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/generator/zip/${siteId}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}
