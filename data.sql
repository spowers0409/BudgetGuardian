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

--
-- Data for Name: budget; Type: TABLE DATA; Schema: public; Owner: sampowers
--

INSERT INTO public.budget (budget_id, category, budgeted, spent) VALUES (1, 'Groceries', 500.00, 0.00);
INSERT INTO public.budget (budget_id, category, budgeted, spent) VALUES (2, 'Rent', 1500.00, 0.00);
INSERT INTO public.budget (budget_id, category, budgeted, spent) VALUES (3, 'Entertainment', 200.00, 0.00);
INSERT INTO public.budget (budget_id, category, budgeted, spent) VALUES (5, 'Mortgage', 1200.00, 0.00);


--
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transaction (transaction_id, transaction_date, category, place, amount) VALUES (1, '2024-02-15', 'Groceries', 'Walmart', 150.25);
INSERT INTO public.transaction (transaction_id, transaction_date, category, place, amount) VALUES (2, '2025-02-15', 'Test', 'Test', 1312.00);
INSERT INTO public.transaction (transaction_id, transaction_date, category, place, amount) VALUES (3, '2025-02-14', 'Test2', 'Test2', 856123.00);
INSERT INTO public.transaction (transaction_id, transaction_date, category, place, amount) VALUES (6, '2025-02-13', 't', 't', 21.00);
INSERT INTO public.transaction (transaction_id, transaction_date, category, place, amount) VALUES (7, '2025-02-14', 'Groceries', 'Market', 32.75);
INSERT INTO public.transaction (transaction_id, transaction_date, category, place, amount) VALUES (8, '2025-02-06', 'Misc.', 'Wal-Mart', 18.52);
INSERT INTO public.transaction (transaction_id, transaction_date, category, place, amount) VALUES (9, '2025-02-16', 'Mortgage', 'Regions', 1159.25);
INSERT INTO public.transaction (transaction_id, transaction_date, category, place, amount) VALUES (10, '2025-02-22', 'Groceries', 'Schnucks', 123.45);


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: sampowers
--

INSERT INTO public."user" (userid, full_name, email, password_hash, created_at, updated_at) VALUES (3, 'Samuel Powers', 'spowers0409@gmail.com', 'Silas!2020', '2025-02-23 00:57:02.790922', '2025-02-23 00:57:02.790922');


--
-- Name: budget_budget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sampowers
--

SELECT pg_catalog.setval('public.budget_budget_id_seq', 5, true);


--
-- Name: transaction_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_transaction_id_seq', 10, true);


--
-- Name: user_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: sampowers
--

SELECT pg_catalog.setval('public.user_userid_seq', 3, true);


--
-- PostgreSQL database dump complete
--

