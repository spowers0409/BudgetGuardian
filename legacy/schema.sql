--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: budget; Type: TABLE; Schema: public; Owner: sampowers
--

CREATE TABLE public.budget (
    budget_id integer NOT NULL,
    category character varying(255) NOT NULL,
    budgeted numeric(10,2) DEFAULT 0.00 NOT NULL,
    spent numeric(10,2) DEFAULT 0.00 NOT NULL
);


ALTER TABLE public.budget OWNER TO sampowers;

--
-- Name: budget_budget_id_seq; Type: SEQUENCE; Schema: public; Owner: sampowers
--

CREATE SEQUENCE public.budget_budget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budget_budget_id_seq OWNER TO sampowers;

--
-- Name: budget_budget_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sampowers
--

ALTER SEQUENCE public.budget_budget_id_seq OWNED BY public.budget.budget_id;


--
-- Name: transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction (
    transaction_id integer NOT NULL,
    transaction_date date NOT NULL,
    category character varying(255) NOT NULL,
    place character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL
);


ALTER TABLE public.transaction OWNER TO postgres;

--
-- Name: transaction_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_transaction_id_seq OWNER TO postgres;

--
-- Name: transaction_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaction_transaction_id_seq OWNED BY public.transaction.transaction_id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: sampowers
--

CREATE TABLE public."user" (
    userid integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public."user" OWNER TO sampowers;

--
-- Name: user_userid_seq; Type: SEQUENCE; Schema: public; Owner: sampowers
--

CREATE SEQUENCE public.user_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_userid_seq OWNER TO sampowers;

--
-- Name: user_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sampowers
--

ALTER SEQUENCE public.user_userid_seq OWNED BY public."user".userid;


--
-- Name: budget budget_id; Type: DEFAULT; Schema: public; Owner: sampowers
--

ALTER TABLE ONLY public.budget ALTER COLUMN budget_id SET DEFAULT nextval('public.budget_budget_id_seq'::regclass);


--
-- Name: transaction transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction ALTER COLUMN transaction_id SET DEFAULT nextval('public.transaction_transaction_id_seq'::regclass);


--
-- Name: user userid; Type: DEFAULT; Schema: public; Owner: sampowers
--

ALTER TABLE ONLY public."user" ALTER COLUMN userid SET DEFAULT nextval('public.user_userid_seq'::regclass);


--
-- Name: budget budget_category_key; Type: CONSTRAINT; Schema: public; Owner: sampowers
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_category_key UNIQUE (category);


--
-- Name: budget budget_pkey; Type: CONSTRAINT; Schema: public; Owner: sampowers
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_pkey PRIMARY KEY (budget_id);


--
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (transaction_id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: sampowers
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: sampowers
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (userid);


--
-- PostgreSQL database dump complete
--

